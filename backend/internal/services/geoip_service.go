package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// GeoIPResponse represents the response from the IP geolocation API
type GeoIPResponse struct {
	Status      string  `json:"status"`
	Country     string  `json:"country"`
	CountryCode string  `json:"countryCode"`
	Region      string  `json:"region"`
	RegionName  string  `json:"regionName"`
	City        string  `json:"city"`
	Zip         string  `json:"zip"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
	Timezone    string  `json:"timezone"`
	ISP         string  `json:"isp"`
	Org         string  `json:"org"`
	AS          string  `json:"as"`
	Query       string  `json:"query"`
}

// GeoIPService handles IP geolocation lookups
type GeoIPService struct {
	client *http.Client
}

// NewGeoIPService creates a new GeoIP service
func NewGeoIPService() *GeoIPService {
	return &GeoIPService{
		client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// GetLocation returns the location info for a given IP address
func (s *GeoIPService) GetLocation(ipAddress string) (*GeoIPResponse, error) {
	// Skip lookup for localhost/private IPs in a real production env,
	// but for dev we might try to lookup if it's a public IP.
	// Common local IPs: ::1, 127.0.0.1
	if ipAddress == "::1" || ipAddress == "127.0.0.1" {
		return &GeoIPResponse{
			Country: "Local Network",
			City:    "Localhost",
		}, nil
	}

	// Using ip-api.com (Free for non-commercial use, 45 requests/minute)
	url := fmt.Sprintf("http://ip-api.com/json/%s", ipAddress)

	resp, err := s.client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var geoResp GeoIPResponse
	if err := json.NewDecoder(resp.Body).Decode(&geoResp); err != nil {
		return nil, err
	}

	if geoResp.Status == "fail" {
		return nil, fmt.Errorf("lookup failed")
	}

	return &geoResp, nil
}
