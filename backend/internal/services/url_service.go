package services

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/repository"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/utils"
	"github.com/skip2/go-qrcode"
)

// URLService handles URL business logic
type URLService struct {
	urlRepo         *repository.URLRepository
	redisService    *RedisService
	shortCodeLength int
	baseURL         string
}

// NewURLService creates a new URL service
func NewURLService(urlRepo *repository.URLRepository, redisService *RedisService, shortCodeLength int, baseURL string) *URLService {
	return &URLService{
		urlRepo:         urlRepo,
		redisService:    redisService,
		shortCodeLength: shortCodeLength,
		baseURL:         baseURL,
	}
}

// CreateShortURL creates a new shortened URL
func (s *URLService) CreateShortURL(userID uint, req *models.CreateURLRequest) (*models.URL, error) {
	// Validate URL
	if !utils.IsValidURL(req.OriginalURL) {
		return nil, errors.New("invalid URL format")
	}

	// Normalize URL
	originalURL := utils.NormalizeURL(req.OriginalURL)

	// Generate short code
	var shortCode string
	var err error

	// If custom alias is provided, use it
	if req.CustomAlias != "" {
		// Validate custom alias
		if !utils.IsValidAlphanumeric(req.CustomAlias) {
			return nil, errors.New("custom alias must be alphanumeric")
		}

		// Check if alias already exists
		exists, err := s.urlRepo.ExistsByShortCode(req.CustomAlias)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.New("custom alias already exists")
		}

		shortCode = req.CustomAlias
	} else {
		// Generate random short code
		maxAttempts := 10
		for i := 0; i < maxAttempts; i++ {
			shortCode, err = utils.GenerateShortCode(s.shortCodeLength)
			if err != nil {
				return nil, errors.New("failed to generate short code")
			}

			// Check if short code already exists
			exists, err := s.urlRepo.ExistsByShortCode(shortCode)
			if err != nil {
				return nil, err
			}
			if !exists {
				break
			}

			// If last attempt and still exists, return error
			if i == maxAttempts-1 {
				return nil, errors.New("failed to generate unique short code")
			}
		}
	}

	// Parse expiration date if provided
	var expiresAt *time.Time
	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		parsedTime, err := time.Parse(time.RFC3339, *req.ExpiresAt)
		if err != nil {
			return nil, errors.New("invalid expiration date format")
		}
		expiresAt = &parsedTime
	}

	// Generate QR Code
	shortURL := s.baseURL + "/" + shortCode
	png, err := qrcode.Encode(shortURL, qrcode.Medium, 256)
	var qrCode string
	if err == nil {
		qrCode = "data:image/png;base64," + base64.StdEncoding.EncodeToString(png)
	}

	var customAlias *string
	if req.CustomAlias != "" {
		customAlias = &req.CustomAlias
	}

	// Create URL
	url := &models.URL{
		UserID:      userID,
		OriginalURL: originalURL,
		ShortCode:   shortCode,
		Title:       req.Title,
		CustomAlias: customAlias,
		QRCode:      qrCode,
		ExpiresAt:   expiresAt,
		IsActive:    true,
	}

	if err := s.urlRepo.Create(url); err != nil {
		return nil, err
	}

	return url, nil
}

// GetURL retrieves a URL by ID
func (s *URLService) GetURL(id uint) (*models.URL, error) {
	return s.urlRepo.FindByID(id)
}

// GetURLByShortCode retrieves a URL by short code
func (s *URLService) GetURLByShortCode(shortCode string) (*models.URL, error) {
	cacheKey := fmt.Sprintf("url:short:%s", shortCode)

	// Try to get from Redis
	cachedVal, err := s.redisService.Get(cacheKey)
	if err == nil && cachedVal != "" {
		var url models.URL
		if err := json.Unmarshal([]byte(cachedVal), &url); err == nil {
			return &url, nil
		}
	}

	// Get from DB
	url, err := s.urlRepo.FindByShortCode(shortCode)
	if err != nil {
		return nil, err
	}

	// Check if URL is expired
	if url.IsExpired() {
		return nil, errors.New("URL has expired")
	}

	// Check if URL is active
	if !url.IsActive {
		return nil, errors.New("URL is not active")
	}

	// Save to Redis (async to not block response? No, usually sync is fine for cache set)
	// We'll marshal the whole object.
	if jsonBytes, err := json.Marshal(url); err == nil {
		s.redisService.Set(cacheKey, jsonBytes, 24*time.Hour)
	}

	return url, nil
}

// GetUserURLs retrieves all URLs for a user with pagination and search
func (s *URLService) GetUserURLs(userID uint, search string, page, limit int) ([]models.URL, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit
	return s.urlRepo.FindByUserID(userID, search, offset, limit)
}

// UpdateURL updates a URL
func (s *URLService) UpdateURL(id, userID uint, req *models.UpdateURLRequest) (*models.URL, error) {
	// Get existing URL
	url, err := s.urlRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Check ownership
	if url.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	// Update fields
	if req.Title != "" {
		url.Title = req.Title
	}

	if req.IsActive != nil {
		url.IsActive = *req.IsActive
	}

	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		parsedTime, err := time.Parse(time.RFC3339, *req.ExpiresAt)
		if err != nil {
			return nil, errors.New("invalid expiration date format")
		}
		url.ExpiresAt = &parsedTime
	}

	if err := s.urlRepo.Update(url); err != nil {
		return nil, err
	}

	// Invalidate cache
	s.redisService.Delete(fmt.Sprintf("url:short:%s", url.ShortCode))

	return url, nil
}

// DeleteURL deletes a URL
func (s *URLService) DeleteURL(id, userID uint) error {
	// Get existing URL
	url, err := s.urlRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Check ownership
	if url.UserID != userID {
		return errors.New("unauthorized")
	}

	if err := s.urlRepo.Delete(id); err != nil {
		return err
	}

	// Invalidate cache
	return s.redisService.Delete(fmt.Sprintf("url:short:%s", url.ShortCode))
}

// IncrementClicks increments the click count for a URL
func (s *URLService) IncrementClicks(id uint) error {
	return s.urlRepo.IncrementClicks(id)
}
