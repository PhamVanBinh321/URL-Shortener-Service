package models

import "time"

// ClickEvent represents a click event to be processed asynchronously
type ClickEvent struct {
	URLID     uint      `json:"url_id"`
	IPAddress string    `json:"ip_address"`
	UserAgent string    `json:"user_agent"`
	Referer   string    `json:"referer"`
	ClickedAt time.Time `json:"clicked_at"`
}
