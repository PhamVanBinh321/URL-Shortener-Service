package models

import (
	"time"
)

// Analytics represents analytics data for URL clicks
type Analytics struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	URLID      uint      `gorm:"not null;index" json:"url_id"`
	IPAddress  string    `gorm:"size:45" json:"ip_address"`
	UserAgent  string    `gorm:"type:text" json:"user_agent"`
	Referer    string    `gorm:"size:255" json:"referer"`
	Country    string    `gorm:"size:100;index" json:"country"`
	City       string    `gorm:"size:100" json:"city"`
	DeviceType string    `gorm:"size:50" json:"device_type"` // desktop, mobile, tablet
	Browser    string    `gorm:"size:50" json:"browser"`
	OS         string    `gorm:"size:50" json:"os"`
	ClickedAt  time.Time `gorm:"autoCreateTime;index" json:"clicked_at"`

	// Relationships
	URL URL `gorm:"foreignKey:URLID;constraint:OnDelete:CASCADE" json:"url,omitempty"`
}

// TableName specifies the table name for Analytics model
func (Analytics) TableName() string {
	return "analytics"
}

// AnalyticsStats represents aggregated analytics statistics
type AnalyticsStats struct {
	TotalClicks     int64                  `json:"total_clicks"`
	UniqueClicks    int64                  `json:"unique_clicks"`
	ClicksByDate    []ClicksByDate         `json:"clicks_by_date"`
	ClicksByCountry []ClicksByCountry      `json:"clicks_by_country"`
	ClicksByDevice  []ClicksByDevice       `json:"clicks_by_device"`
	ClicksByBrowser []ClicksByBrowser      `json:"clicks_by_browser"`
	TopReferers     []TopReferer           `json:"top_referers"`
}

// ClicksByDate represents clicks grouped by date
type ClicksByDate struct {
	Date   string `json:"date"`
	Clicks int64  `json:"clicks"`
}

// ClicksByCountry represents clicks grouped by country
type ClicksByCountry struct {
	Country string `json:"country"`
	Clicks  int64  `json:"clicks"`
}

// ClicksByDevice represents clicks grouped by device type
type ClicksByDevice struct {
	DeviceType string `json:"device_type"`
	Clicks     int64  `json:"clicks"`
}

// ClicksByBrowser represents clicks grouped by browser
type ClicksByBrowser struct {
	Browser string `json:"browser"`
	Clicks  int64  `json:"clicks"`
}

// TopReferer represents top referrers
type TopReferer struct {
	Referer string `json:"referer"`
	Clicks  int64  `json:"clicks"`
}
