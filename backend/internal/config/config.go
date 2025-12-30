package config

import (
	"fmt"
	"log"
	"time"

	"github.com/spf13/viper"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	App      AppConfig
	Redis    RedisConfig
}

// RedisConfig holds Redis-related configuration
type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	Port string
	Host string
	Mode string // debug, release, test
}

// DatabaseConfig holds database-related configuration
type DatabaseConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	Name            string
	MaxIdleConns    int
	MaxOpenConns    int
	ConnMaxLifetime time.Duration
}

// JWTConfig holds JWT-related configuration
type JWTConfig struct {
	Secret            string
	Expiration        time.Duration
	RefreshExpiration time.Duration
}

// CORSConfig holds CORS-related configuration
type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

// AppConfig holds application-specific configuration
type AppConfig struct {
	Name           string
	Env            string
	BaseURL        string
	ShortURLLength int
}

// Load loads configuration from config file and environment variables
func Load(configPath string) (*Config, error) {
	viper.SetConfigFile(configPath)
	viper.SetConfigType("yaml")

	// Read environment variables
	viper.AutomaticEnv()

	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var cfg Config

	// Server config
	cfg.Server.Port = viper.GetString("server.port")
	if cfg.Server.Port == "" {
		cfg.Server.Port = "8080"
	}
	cfg.Server.Host = viper.GetString("server.host")
	cfg.Server.Mode = viper.GetString("server.mode")

	// Database config
	cfg.Database.Host = viper.GetString("database.host")
	cfg.Database.Port = viper.GetInt("database.port")
	cfg.Database.User = viper.GetString("database.user")
	cfg.Database.Password = viper.GetString("database.password")
	cfg.Database.Name = viper.GetString("database.name")
	cfg.Database.MaxIdleConns = viper.GetInt("database.max_idle_conns")
	cfg.Database.MaxOpenConns = viper.GetInt("database.max_open_conns")
	cfg.Database.ConnMaxLifetime = time.Duration(viper.GetInt("database.conn_max_lifetime")) * time.Second

	// JWT config
	cfg.JWT.Secret = viper.GetString("jwt.secret")
	cfg.JWT.Expiration, _ = time.ParseDuration(viper.GetString("jwt.expiration"))
	cfg.JWT.RefreshExpiration, _ = time.ParseDuration(viper.GetString("jwt.refresh_expiration"))

	// CORS config
	cfg.CORS.AllowedOrigins = viper.GetStringSlice("cors.allowed_origins")
	cfg.CORS.AllowedMethods = viper.GetStringSlice("cors.allowed_methods")
	cfg.CORS.AllowedHeaders = viper.GetStringSlice("cors.allowed_headers")

	// App config
	cfg.App.Name = viper.GetString("app.name")
	cfg.App.Env = viper.GetString("app.env")
	cfg.App.BaseURL = viper.GetString("app.base_url")
	cfg.App.ShortURLLength = viper.GetInt("app.short_url_length")
	if cfg.App.ShortURLLength == 0 {
		cfg.App.ShortURLLength = 7
	}

	// Redis config
	cfg.Redis.Host = viper.GetString("redis.host")
	cfg.Redis.Port = viper.GetInt("redis.port")
	cfg.Redis.Password = viper.GetString("redis.password")
	cfg.Redis.DB = viper.GetInt("redis.db")

	log.Printf("Configuration loaded successfully from %s", configPath)
	return &cfg, nil
}

// GetDSN returns the database connection string
func (c *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.User, c.Password, c.Host, c.Port, c.Name)
}
