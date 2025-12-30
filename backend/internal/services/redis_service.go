package services

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// RedisService handles Redis operations
type RedisService struct {
	client *redis.Client
	ctx    context.Context
}

// NewRedisService creates a new Redis service
func NewRedisService(host string, port int, password string, db int) *RedisService {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", host, port),
		Password: password,
		DB:       db,
	})

	return &RedisService{
		client: client,
		ctx:    context.Background(),
	}
}

// Set stores a key-value pair in Redis with an optional expiration
func (s *RedisService) Set(key string, value interface{}, expiration time.Duration) error {
	return s.client.Set(s.ctx, key, value, expiration).Err()
}

// Get retrieves a value from Redis
func (s *RedisService) Get(key string) (string, error) {
	return s.client.Get(s.ctx, key).Result()
}

// DELETE removes a key from Redis
func (s *RedisService) Delete(key string) error {
	return s.client.Del(s.ctx, key).Err()
}

// Ping checks the Redis connection
func (s *RedisService) Ping() error {
	_, err := s.client.Ping(s.ctx).Result()
	return err
}

// Close closes the Redis connection
func (s *RedisService) Close() error {
	return s.client.Close()
}
