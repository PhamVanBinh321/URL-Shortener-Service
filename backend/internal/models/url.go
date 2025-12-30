package models

import (
	"time"
)

// URL represents a shortened URL
type URL struct {
	ID          uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      uint       `gorm:"not null;index" json:"user_id"`
	OriginalURL string     `gorm:"type:text;not null" json:"original_url" validate:"required,url"`
	ShortCode   string     `gorm:"uniqueIndex;not null;size:10" json:"short_code"`
	Title       string     `gorm:"size:255" json:"title"`
	CustomAlias string     `gorm:"uniqueIndex;size:50" json:"custom_alias,omitempty"`
	QRCode      string     `gorm:"type:text" json:"qr_code,omitempty"`
	Clicks      int        `gorm:"default:0" json:"clicks"`
	CreatedAt   time.Time  `gorm:"autoCreateTime;index" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
	ExpiresAt   *time.Time `gorm:"index" json:"expires_at,omitempty"`
	IsActive    bool       `gorm:"default:true" json:"is_active"`

	// Relationships
	User      User        `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
	Analytics []Analytics `gorm:"foreignKey:URLID;constraint:OnDelete:CASCADE" json:"analytics,omitempty"`
}

// TableName specifies the table name for URL model
func (URL) TableName() string {
	return "urls"
}

// CreateURLRequest represents the request to create a shortened URL
type CreateURLRequest struct {
	OriginalURL string  `json:"original_url" validate:"required,url"`
	Title       string  `json:"title"`
	CustomAlias string  `json:"custom_alias,omitempty" validate:"omitempty,alphanum,max=50"`
	ExpiresAt   *string `json:"expires_at,omitempty"`
}

// UpdateURLRequest represents the request to update a URL
type UpdateURLRequest struct {
	Title     string  `json:"title"`
	IsActive  *bool   `json:"is_active,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
}

// URLResponse represents the URL response
type URLResponse struct {
	ID          uint       `json:"id"`
	OriginalURL string     `json:"original_url"`
	ShortCode   string     `json:"short_code"`
	ShortURL    string     `json:"short_url"`
	Title       string     `json:"title"`
	CustomAlias string     `json:"custom_alias,omitempty"`
	QRCode      string     `json:"qr_code,omitempty"`
	Clicks      int        `json:"clicks"`
	CreatedAt   time.Time  `json:"created_at"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
	IsActive    bool       `json:"is_active"`
}

// ToResponse converts URL to URLResponse
func (u *URL) ToResponse(baseURL string) *URLResponse {
	shortURL := baseURL + "/" + u.ShortCode
	if u.CustomAlias != "" {
		shortURL = baseURL + "/" + u.CustomAlias
	}

	return &URLResponse{
		ID:          u.ID,
		OriginalURL: u.OriginalURL,
		ShortCode:   u.ShortCode,
		ShortURL:    shortURL,
		Title:       u.Title,
		CustomAlias: u.CustomAlias,
		QRCode:      u.QRCode,
		Clicks:      u.Clicks,
		CreatedAt:   u.CreatedAt,
		ExpiresAt:   u.ExpiresAt,
		IsActive:    u.IsActive,
	}
}

// IsExpired checks if the URL has expired
func (u *URL) IsExpired() bool {
	if u.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*u.ExpiresAt)
}
