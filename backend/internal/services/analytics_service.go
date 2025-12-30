package services

import (
	"strings"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/repository"
)

// AnalyticsService handles analytics business logic
type AnalyticsService struct {
	analyticsRepo *repository.AnalyticsRepository
	urlRepo       *repository.URLRepository
}

// NewAnalyticsService creates a new analytics service
func NewAnalyticsService(analyticsRepo *repository.AnalyticsRepository, urlRepo *repository.URLRepository) *AnalyticsService {
	return &AnalyticsService{
		analyticsRepo: analyticsRepo,
		urlRepo:       urlRepo,
	}
}

// TrackClick tracks a URL click
func (s *AnalyticsService) TrackClick(urlID uint, ipAddress, userAgent, referer string) error {
	// Parse device type and browser from user agent
	deviceType := s.parseDeviceType(userAgent)
	browser := s.parseBrowser(userAgent)
	os := s.parseOS(userAgent)

	analytics := &models.Analytics{
		URLID:      urlID,
		IPAddress:  ipAddress,
		UserAgent:  userAgent,
		Referer:    referer,
		DeviceType: deviceType,
		Browser:    browser,
		OS:         os,
		// Country and City would be populated by IP geolocation service
		// For now, we'll leave them empty
	}

	return s.analyticsRepo.Create(analytics)
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

// parseDeviceType parses device type from user agent
func (s *AnalyticsService) parseDeviceType(userAgent string) string {
	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		return "mobile"
	}

	if strings.Contains(ua, "tablet") || strings.Contains(ua, "ipad") {
		return "tablet"
	}

	return "desktop"
}

// parseBrowser parses browser from user agent
func (s *AnalyticsService) parseBrowser(userAgent string) string {
	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "edg") {
		return "Edge"
	}
	if strings.Contains(ua, "chrome") {
		return "Chrome"
	}
	if strings.Contains(ua, "firefox") {
		return "Firefox"
	}
	if strings.Contains(ua, "safari") {
		return "Safari"
	}
	if strings.Contains(ua, "opera") || strings.Contains(ua, "opr") {
		return "Opera"
	}

	return "Other"
}

// parseOS parses operating system from user agent
func (s *AnalyticsService) parseOS(userAgent string) string {
	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "windows") {
		return "Windows"
	}
	if strings.Contains(ua, "mac os") || strings.Contains(ua, "macos") {
		return "macOS"
	}
	if strings.Contains(ua, "linux") {
		return "Linux"
	}
	if strings.Contains(ua, "android") {
		return "Android"
	}
	if strings.Contains(ua, "ios") || strings.Contains(ua, "iphone") || strings.Contains(ua, "ipad") {
		return "iOS"
	}

	return "Other"
}
