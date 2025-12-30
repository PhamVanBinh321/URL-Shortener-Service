package repository

import (
	"errors"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"gorm.io/gorm"
)

// URLRepository handles URL data access
type URLRepository struct {
	db *gorm.DB
}

// NewURLRepository creates a new URL repository
func NewURLRepository(db *gorm.DB) *URLRepository {
	return &URLRepository{db: db}
}

// Create creates a new URL
func (r *URLRepository) Create(url *models.URL) error {
	return r.db.Create(url).Error
}

// FindByID finds a URL by ID
func (r *URLRepository) FindByID(id uint) (*models.URL, error) {
	var url models.URL
	err := r.db.Preload("User").First(&url, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("URL not found")
		}
		return nil, err
	}
	return &url, nil
}

// FindByShortCode finds a URL by short code
func (r *URLRepository) FindByShortCode(shortCode string) (*models.URL, error) {
	var url models.URL
	err := r.db.Where("short_code = ?", shortCode).Or("custom_alias = ?", shortCode).First(&url).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("URL not found")
		}
		return nil, err
	}
	return &url, nil
}

// FindByUserID finds all URLs belonging to a user
func (r *URLRepository) FindByUserID(userID uint, offset, limit int) ([]models.URL, int64, error) {
	var urls []models.URL
	var total int64

	// Count total
	if err := r.db.Model(&models.URL{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := r.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&urls).Error

	if err != nil {
		return nil, 0, err
	}

	return urls, total, nil
}

// Update updates a URL
func (r *URLRepository) Update(url *models.URL) error {
	return r.db.Save(url).Error
}

// Delete deletes a URL
func (r *URLRepository) Delete(id uint) error {
	return r.db.Delete(&models.URL{}, id).Error
}

// IncrementClicks increments the click count for a URL
func (r *URLRepository) IncrementClicks(id uint) error {
	return r.db.Model(&models.URL{}).Where("id = ?", id).UpdateColumn("clicks", gorm.Expr("clicks + ?", 1)).Error
}

// ExistsByShortCode checks if a short code exists
func (r *URLRepository) ExistsByShortCode(shortCode string) (bool, error) {
	var count int64
	err := r.db.Model(&models.URL{}).Where("short_code = ? OR custom_alias = ?", shortCode, shortCode).Count(&count).Error
	return count > 0, err
}

// FindActiveByUserID finds all active URLs belonging to a user
func (r *URLRepository) FindActiveByUserID(userID uint) ([]models.URL, error) {
	var urls []models.URL
	err := r.db.Where("user_id = ? AND is_active = ?", userID, true).
		Order("created_at DESC").
		Find(&urls).Error
	return urls, err
}
