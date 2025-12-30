package handlers

import (
	"net/http"
	"strconv"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/middleware"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/services"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// AnalyticsHandler handles analytics requests
type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
}

// NewAnalyticsHandler creates a new analytics handler
func NewAnalyticsHandler(analyticsService *services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
	}
}

// GetURLAnalytics handles getting analytics for a specific URL
// @Summary Get URL analytics
// @Tags Analytics
// @Produce json
// @Param urlId path int true "URL ID"
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {object} utils.PaginatedResponse
// @Security BearerAuth
// @Router /api/analytics/{urlId} [get]
func (h *AnalyticsHandler) GetURLAnalytics(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	urlID, err := strconv.ParseUint(c.Param("urlId"), 10, 32)
	if err != nil {
		utils.ValidationErrorResponse(c, "Invalid URL ID")
		return
	}

	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	// Get analytics
	analytics, total, err := h.analyticsService.GetURLAnalytics(uint(urlID), userID, page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve analytics", err.Error())
		return
	}

	if analytics == nil {
		utils.ForbiddenResponse(c, "Unauthorized access")
		return
	}

	utils.PaginatedSuccessResponse(c, http.StatusOK, "Analytics retrieved successfully", analytics, page, limit, total)
}

// GetURLStats handles getting aggregated statistics for a URL
// @Summary Get URL statistics
// @Tags Analytics
// @Produce json
// @Param urlId path int true "URL ID"
// @Param days query int false "Number of days (default: 30)"
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /api/analytics/{urlId}/stats [get]
func (h *AnalyticsHandler) GetURLStats(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	urlID, err := strconv.ParseUint(c.Param("urlId"), 10, 32)
	if err != nil {
		utils.ValidationErrorResponse(c, "Invalid URL ID")
		return
	}

	// Get days parameter
	days, _ := strconv.Atoi(c.DefaultQuery("days", "30"))
	if days < 1 {
		days = 30
	}
	if days > 365 {
		days = 365
	}

	// Get stats
	stats, err := h.analyticsService.GetURLStats(uint(urlID), userID, days)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve statistics", err.Error())
		return
	}

	if stats == nil {
		utils.ForbiddenResponse(c, "Unauthorized access")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Statistics retrieved successfully", stats)
}
