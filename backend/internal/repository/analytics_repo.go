package repository

import (
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"gorm.io/gorm"
)

// AnalyticsRepository handles analytics data access
type AnalyticsRepository struct {
	db *gorm.DB
}

// NewAnalyticsRepository creates a new analytics repository
func NewAnalyticsRepository(db *gorm.DB) *AnalyticsRepository {
	return &AnalyticsRepository{db: db}
}

// Create creates a new analytics record
func (r *AnalyticsRepository) Create(analytics *models.Analytics) error {
	return r.db.Create(analytics).Error
}

// FindByURLID finds all analytics for a specific URL
func (r *AnalyticsRepository) FindByURLID(urlID uint, offset, limit int) ([]models.Analytics, int64, error) {
	var analytics []models.Analytics
	var total int64

	// Count total
	if err := r.db.Model(&models.Analytics{}).Where("url_id = ?", urlID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := r.db.Where("url_id = ?", urlID).
		Order("clicked_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&analytics).Error

	if err != nil {
		return nil, 0, err
	}

	return analytics, total, nil
}

// GetStats gets aggregated statistics for a URL
func (r *AnalyticsRepository) GetStats(urlID uint, startDate, endDate time.Time) (*models.AnalyticsStats, error) {
	stats := &models.AnalyticsStats{}

	// Total clicks
	r.db.Model(&models.Analytics{}).
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Count(&stats.TotalClicks)

	// Unique clicks (by IP)
	r.db.Model(&models.Analytics{}).
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Distinct("ip_address").
		Count(&stats.UniqueClicks)

	// Clicks by date
	var clicksByDate []models.ClicksByDate
	r.db.Model(&models.Analytics{}).
		Select("DATE(clicked_at) as date, COUNT(*) as clicks").
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Group("DATE(clicked_at)").
		Order("date DESC").
		Scan(&clicksByDate)
	stats.ClicksByDate = clicksByDate

	// Clicks by country
	var clicksByCountry []models.ClicksByCountry
	r.db.Model(&models.Analytics{}).
		Select("country, COUNT(*) as clicks").
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Group("country").
		Order("clicks DESC").
		Limit(10).
		Scan(&clicksByCountry)
	stats.ClicksByCountry = clicksByCountry

	// Clicks by device
	var clicksByDevice []models.ClicksByDevice
	r.db.Model(&models.Analytics{}).
		Select("device_type, COUNT(*) as clicks").
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Group("device_type").
		Order("clicks DESC").
		Scan(&clicksByDevice)
	stats.ClicksByDevice = clicksByDevice

	// Clicks by browser
	var clicksByBrowser []models.ClicksByBrowser
	r.db.Model(&models.Analytics{}).
		Select("browser, COUNT(*) as clicks").
		Where("url_id = ? AND clicked_at BETWEEN ? AND ?", urlID, startDate, endDate).
		Group("browser").
		Order("clicks DESC").
		Limit(10).
		Scan(&clicksByBrowser)
	stats.ClicksByBrowser = clicksByBrowser

	// Top referers
	var topReferers []models.TopReferer
	r.db.Model(&models.Analytics{}).
		Select("referer, COUNT(*) as clicks").
		Where("url_id = ? AND clicked_at BETWEEN ? AND ? AND referer != ''", urlID, startDate, endDate).
		Group("referer").
		Order("clicks DESC").
		Limit(10).
		Scan(&topReferers)
	stats.TopReferers = topReferers

	return stats, nil
}

// GetCountryStats gets country-based statistics
func (r *AnalyticsRepository) GetCountryStats(urlID uint) ([]models.ClicksByCountry, error) {
	var stats []models.ClicksByCountry
	err := r.db.Model(&models.Analytics{}).
		Select("country, COUNT(*) as clicks").
		Where("url_id = ?", urlID).
		Group("country").
		Order("clicks DESC").
		Scan(&stats).Error
	return stats, err
}

// GetDeviceStats gets device-based statistics
func (r *AnalyticsRepository) GetDeviceStats(urlID uint) ([]models.ClicksByDevice, error) {
	var stats []models.ClicksByDevice
	err := r.db.Model(&models.Analytics{}).
		Select("device_type, COUNT(*) as clicks").
		Where("url_id = ?", urlID).
		Group("device_type").
		Order("clicks DESC").
		Scan(&stats).Error
	return stats, err
}

// DeleteByURLID deletes all analytics for a specific URL
func (r *AnalyticsRepository) DeleteByURLID(urlID uint) error {
	return r.db.Where("url_id = ?", urlID).Delete(&models.Analytics{}).Error
}
