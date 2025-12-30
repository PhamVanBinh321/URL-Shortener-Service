package services

import (
	"context"
	"encoding/json"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
)

// QueueService handles message queue operations
type QueueService struct {
	redisService *RedisService
	queueName    string
}

// NewQueueService creates a new queue service
func NewQueueService(redisService *RedisService) *QueueService {
	return &QueueService{
		redisService: redisService,
		queueName:    "analytics:queue",
	}
}

// Publish publishes an event to the queue
func (s *QueueService) Publish(ctx context.Context, event *models.ClickEvent) error {
	data, err := json.Marshal(event)
	if err != nil {
		return err
	}

	// Use RPUSH to add to the end of the queue
	return s.redisService.client.RPush(ctx, s.queueName, data).Err()
}

// Consume consumes events from the queue (blocking)
func (s *QueueService) Consume(ctx context.Context) (*models.ClickEvent, error) {
	// Use BLPOP to block until an item is available (0 means wait indefinitely)
	result, err := s.redisService.client.BLPop(ctx, 0*time.Second, s.queueName).Result()
	if err != nil {
		return nil, err
	}

	// result[0] is the key, result[1] is the value
	var event models.ClickEvent
	if err := json.Unmarshal([]byte(result[1]), &event); err != nil {
		return nil, err
	}

	return &event, nil
}
