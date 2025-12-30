package handlers

import (
	"net/http"
	"strconv"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/middleware"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/services"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// URLHandler handles URL requests
type URLHandler struct {
	urlService       *services.URLService
	analyticsService *services.AnalyticsService
	validate         *validator.Validate
	baseURL          string
}

// NewURLHandler creates a new URL handler
func NewURLHandler(urlService *services.URLService, analyticsService *services.AnalyticsService, baseURL string) *URLHandler {
	return &URLHandler{
		urlService:       urlService,
		analyticsService: analyticsService,
		validate:         validator.New(),
		baseURL:          baseURL,
	}
}

// CreateURL handles creating a new shortened URL
// @Summary Create a shortened URL
// @Tags URLs
// @Accept json
// @Produce json
// @Param request body models.CreateURLRequest true "Create URL request"
// @Success 201 {object} utils.Response
// @Security BearerAuth
// @Router /api/urls [post]
func (h *URLHandler) CreateURL(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	var req models.CreateURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Validate request
	if err := h.validate.Struct(req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Create URL
	url, err := h.urlService.CreateShortURL(userID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "URL created successfully", url.ToResponse(h.baseURL))
}

// GetUserURLs handles getting all URLs for a user
// @Summary Get user URLs
// @Tags URLs
// @Produce json
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {object} utils.PaginatedResponse
// @Security BearerAuth
// @Router /api/urls [get]
func (h *URLHandler) GetUserURLs(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	// Get pagination and search parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.DefaultQuery("search", "")

	// Get URLs
	urls, total, err := h.urlService.GetUserURLs(userID, search, page, limit)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve URLs", err.Error())
		return
	}

	// Convert to responses
	responses := make([]interface{}, len(urls))
	for i, url := range urls {
		responses[i] = url.ToResponse(h.baseURL)
	}

	utils.PaginatedSuccessResponse(c, http.StatusOK, "URLs retrieved successfully", responses, page, limit, total)
}

// GetURL handles getting a specific URL by ID
// @Summary Get URL by ID
// @Tags URLs
// @Produce json
// @Param id path int true "URL ID"
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /api/urls/{id} [get]
func (h *URLHandler) GetURL(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ValidationErrorResponse(c, "Invalid URL ID")
		return
	}

	url, err := h.urlService.GetURL(uint(id))
	if err != nil {
		utils.NotFoundResponse(c, "URL not found")
		return
	}

	// Check ownership
	if url.UserID != userID {
		utils.ForbiddenResponse(c, "Unauthorized access")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "URL retrieved successfully", url.ToResponse(h.baseURL))
}

// UpdateURL handles updating a URL
// @Summary Update URL
// @Tags URLs
// @Accept json
// @Produce json
// @Param id path int true "URL ID"
// @Param request body models.UpdateURLRequest true "Update URL request"
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /api/urls/{id} [put]
func (h *URLHandler) UpdateURL(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ValidationErrorResponse(c, "Invalid URL ID")
		return
	}

	var req models.UpdateURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Update URL
	url, err := h.urlService.UpdateURL(uint(id), userID, &req)
	if err != nil {
		if err.Error() == "unauthorized" {
			utils.ForbiddenResponse(c, "Unauthorized access")
			return
		}
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "URL updated successfully", url.ToResponse(h.baseURL))
}

// DeleteURL handles deleting a URL
// @Summary Delete URL
// @Tags URLs
// @Produce json
// @Param id path int true "URL ID"
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /api/urls/{id} [delete]
func (h *URLHandler) DeleteURL(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ValidationErrorResponse(c, "Invalid URL ID")
		return
	}

	// Delete URL
	if err := h.urlService.DeleteURL(uint(id), userID); err != nil {
		if err.Error() == "unauthorized" {
			utils.ForbiddenResponse(c, "Unauthorized access")
			return
		}
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "URL deleted successfully", nil)
}

// RedirectURL handles redirecting short URLs to original URLs
// @Summary Redirect short URL
// @Tags URLs
// @Param shortCode path string true "Short code"
// @Success 302
// @Router /{shortCode} [get]
func (h *URLHandler) RedirectURL(c *gin.Context) {
	shortCode := c.Param("shortCode")

	// Get URL
	url, err := h.urlService.GetURLByShortCode(shortCode)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "URL not found or expired",
		})
		return
	}

	// Track analytics
	go func() {
		h.analyticsService.TrackClick(
			url.ID,
			c.ClientIP(),
			c.Request.UserAgent(),
			c.Request.Referer(),
		)
		h.urlService.IncrementClicks(url.ID)
	}()

	// Redirect
	c.Redirect(http.StatusFound, url.OriginalURL)
}
