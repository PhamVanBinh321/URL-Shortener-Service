package services

import (
	"context"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/repository"
)

// AnalyticsService handles analytics business logic
type AnalyticsService struct {
	analyticsRepo *repository.AnalyticsRepository
	urlRepo       *repository.URLRepository
	queueService  *QueueService
	geoIPService  *GeoIPService
}

// NewAnalyticsService creates a new analytics service
func NewAnalyticsService(analyticsRepo *repository.AnalyticsRepository, urlRepo *repository.URLRepository, queueService *QueueService, geoIPService *GeoIPService) *AnalyticsService {
	return &AnalyticsService{
		analyticsRepo: analyticsRepo,
		urlRepo:       urlRepo,
		queueService:  queueService,
		geoIPService:  geoIPService,
	}
}

// TrackClick tracks a URL click
func (s *AnalyticsService) TrackClick(urlID uint, ipAddress, userAgent, referer string) error {
	event := &models.ClickEvent{
		URLID:     urlID,
		IPAddress: ipAddress,
		UserAgent: userAgent,
		Referer:   referer,
		ClickedAt: time.Now(),
	}

	// Publish to queue for async processing
	return s.queueService.Publish(context.Background(), event)
}

// GetURLAnalytics retrieves analytics for a specific URL
func (s *AnalyticsService) GetURLAnalytics(urlID, userID uint, page, limit int) ([]models.Analytics, int64, error) {
	// Verify URL ownership
	url, err := s.urlRepo.FindByID(urlID)
	if err != nil {
		return nil, 0, err
	}

	if url.UserID != userID {
		return nil, 0, nil
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit
	return s.analyticsRepo.FindByURLID(urlID, offset, limit)
}

// GetURLStats retrieves aggregated statistics for a URL
func (s *AnalyticsService) GetURLStats(urlID, userID uint, days int) (*models.AnalyticsStats, error) {
	// Verify URL ownership
	url, err := s.urlRepo.FindByID(urlID)
	if err != nil {
		return nil, err
	}

	if url.UserID != userID {
		return nil, nil
	}

	// Calculate date range
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -days)

	return s.analyticsRepo.GetStats(urlID, startDate, endDate)
}

// GetOverviewStats retrieves aggregated statistics for all user URLs
func (s *AnalyticsService) GetOverviewStats(userID uint, days int) (*models.AnalyticsStats, error) {
	// Calculate date range
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -days)

	return s.analyticsRepo.GetOverviewStats(userID, startDate, endDate)
}
