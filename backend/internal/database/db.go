package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/config"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect establishes a connection to the database
func Connect(cfg *config.DatabaseConfig) error {
	dsn := cfg.GetDSN()

	// Configure GORM logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL DB to set connection pool settings
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	log.Println("Database connection established successfully")
	return nil
}

// AutoMigrate runs automatic migrations for all models
func AutoMigrate() error {
	log.Println("Running database auto-migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.URL{},
		&models.Analytics{},
	)

	if err != nil {
		return fmt.Errorf("failed to run auto-migrations: %w", err)
	}

	log.Println("Database auto-migrations completed successfully")
	return nil
}

// Close closes the database connection
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	if err := sqlDB.Close(); err != nil {
		return fmt.Errorf("failed to close database connection: %w", err)
	}

	log.Println("Database connection closed")
	return nil
}

// Ping checks if the database connection is alive
func Ping() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}

	return nil
}
