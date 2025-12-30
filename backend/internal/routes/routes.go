package routes

import (
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/handlers"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all application routes
func SetupRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
	urlHandler *handlers.URLHandler,
	analyticsHandler *handlers.AnalyticsHandler,
	authMiddleware *middleware.AuthMiddleware,
) {
	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "URL Shortener Service is running",
		})
	})

	// Redirect endpoint (public)
	router.GET("/:shortCode", urlHandler.RedirectURL)

	// API routes
	api := router.Group("/api")
	{
		// Authentication routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)

			// Protected auth routes
			auth.GET("/me", authMiddleware.RequireAuth(), authHandler.GetCurrentUser)
		}

		// URL routes (protected)
		urls := api.Group("/urls")
		urls.Use(authMiddleware.RequireAuth())
		{
			urls.POST("", urlHandler.CreateURL)
			urls.GET("", urlHandler.GetUserURLs)
			urls.GET("/:id", urlHandler.GetURL)
			urls.PUT("/:id", urlHandler.UpdateURL)
			urls.DELETE("/:id", urlHandler.DeleteURL)
		}

		// Analytics routes (protected)
		analytics := api.Group("/analytics")
		analytics.Use(authMiddleware.RequireAuth())
		{
			analytics.GET("/:urlId", analyticsHandler.GetURLAnalytics)
			analytics.GET("/:urlId/stats", analyticsHandler.GetURLStats)
		}
	}
}
