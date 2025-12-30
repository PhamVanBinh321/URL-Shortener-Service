package utils

import "strings"

// ParseDeviceType parses device type from user agent
func ParseDeviceType(userAgent string) string {
	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		return "mobile"
	}

	if strings.Contains(ua, "tablet") || strings.Contains(ua, "ipad") {
		return "tablet"
	}

	return "desktop"
}

// ParseBrowser parses browser from user agent
func ParseBrowser(userAgent string) string {
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

// ParseOS parses operating system from user agent
func ParseOS(userAgent string) string {
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
