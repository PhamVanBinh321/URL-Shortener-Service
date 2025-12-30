package main

import (
	"fmt"
	"log"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/config"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/database"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/handlers"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/middleware"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/repository"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/routes"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/services"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/worker"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.Load("./configs/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Set Gin mode
	gin.SetMode(cfg.Server.Mode)

	// Connect to database
	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run auto migrations
	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Ping database
	if err := database.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(database.DB)
	urlRepo := repository.NewURLRepository(database.DB)
	analyticsRepo := repository.NewAnalyticsRepository(database.DB)

	// Initialize services
	redisService := services.NewRedisService(cfg.Redis.Host, cfg.Redis.Port, cfg.Redis.Password, cfg.Redis.DB)
	authService := services.NewAuthService(userRepo, cfg.JWT.Secret, cfg.JWT.Expiration)

	geoIPService := services.NewGeoIPService()
	queueService := services.NewQueueService(redisService)
	urlService := services.NewURLService(urlRepo, redisService, cfg.App.ShortURLLength, cfg.App.BaseURL)
	analyticsService := services.NewAnalyticsService(analyticsRepo, urlRepo, queueService, geoIPService)

	// Start Analytics Worker
	analyticsWorker := worker.NewAnalyticsWorker(queueService, analyticsRepo, geoIPService)
	analyticsWorker.Start()
	defer analyticsWorker.Stop()

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	urlHandler := handlers.NewURLHandler(urlService, analyticsService, cfg.App.BaseURL)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Create Gin router
	router := gin.New()

	// Setup global middleware
	router.Use(gin.Recovery())
	router.Use(middleware.Logger())
	router.Use(middleware.SetupCORS(cfg.CORS.AllowedOrigins))

	// Setup routes
	routes.SetupRoutes(router, authHandler, urlHandler, analyticsHandler, authMiddleware)

	// Start server
	serverAddr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Starting server on %s", serverAddr)
	log.Printf("Environment: %s", cfg.App.Env)
	log.Printf("Base URL: %s", cfg.App.BaseURL)

	if err := router.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
