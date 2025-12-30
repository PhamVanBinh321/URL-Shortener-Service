package utils

import (
	"net/url"
	"regexp"
	"strings"
)

var (
	// Email regex pattern
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
)

// IsValidEmail validates email format
func IsValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// IsValidURL validates URL format
func IsValidURL(urlStr string) bool {
	u, err := url.Parse(urlStr)
	if err != nil {
		return false
	}
	return u.Scheme != "" && u.Host != ""
}

// IsValidAlphanumeric checks if string contains only alphanumeric characters
func IsValidAlphanumeric(s string) bool {
	match, _ := regexp.MatchString(`^[a-zA-Z0-9]+$`, s)
	return match
}

// SanitizeString removes leading/trailing whitespace and converts to lowercase
func SanitizeString(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}

// ValidatePassword checks password strength
// At least 6 characters
func ValidatePassword(password string) bool {
	return len(password) >= 6
}

// NormalizeURL adds http:// if scheme is missing
func NormalizeURL(urlStr string) string {
	if !strings.HasPrefix(urlStr, "http://") && !strings.HasPrefix(urlStr, "https://") {
		return "http://" + urlStr
	}
	return urlStr
}
