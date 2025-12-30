package worker

import (
	"context"
	"log"
	"time"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/repository"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/services"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/utils"
)

// AnalyticsWorker processes analytics events from the queue
type AnalyticsWorker struct {
	queueService  *services.QueueService
	analyticsRepo *repository.AnalyticsRepository
	geoIPService  *services.GeoIPService
	quit          chan bool
}

// NewAnalyticsWorker creates a new analytics worker
func NewAnalyticsWorker(queueService *services.QueueService, analyticsRepo *repository.AnalyticsRepository, geoIPService *services.GeoIPService) *AnalyticsWorker {
	return &AnalyticsWorker{
		queueService:  queueService,
		analyticsRepo: analyticsRepo,
		geoIPService:  geoIPService,
		quit:          make(chan bool),
	}
}

// Start starts the worker loop
func (w *AnalyticsWorker) Start() {
	go func() {
		log.Println("Analytics Worker started")
		for {
			select {
			case <-w.quit:
				return
			default:
				w.processNextEvent()
			}
		}
	}()
}

// Stop stops the worker
func (w *AnalyticsWorker) Stop() {
	w.quit <- true
}

func (w *AnalyticsWorker) processNextEvent() {
	ctx := context.Background()
	event, err := w.queueService.Consume(ctx)
	if err != nil {
		// Log error but continue (beware of tight loops on error if Redis is down)
		// Ideally adding a small sleep on error
		time.Sleep(1 * time.Second)
		return
	}

	w.processEvent(event)
}

func (w *AnalyticsWorker) processEvent(event *models.ClickEvent) {
	log.Printf("Worker: Processing click event for URL ID %d from IP %s", event.URLID, event.IPAddress)

	// Parse Details
	deviceType := utils.ParseDeviceType(event.UserAgent)
	browser := utils.ParseBrowser(event.UserAgent)
	os := utils.ParseOS(event.UserAgent)

	// GeoIP Lookup
	geoResp, err := w.geoIPService.GetLocation(event.IPAddress)
	var country, city string
	if err == nil && geoResp != nil {
		country = geoResp.Country
		city = geoResp.City
	}

	analytics := &models.Analytics{
		URLID:      event.URLID,
		IPAddress:  event.IPAddress,
		UserAgent:  event.UserAgent,
		Referer:    event.Referer,
		Country:    country,
		City:       city,
		DeviceType: deviceType,
		Browser:    browser,
		OS:         os,
		ClickedAt:  event.ClickedAt,
	}

	if err := w.analyticsRepo.Create(analytics); err != nil {
		log.Printf("Failed to save analytics: %v", err)
	}
}
