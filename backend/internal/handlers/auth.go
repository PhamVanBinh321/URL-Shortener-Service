package handlers

import (
	"net/http"

	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/middleware"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/models"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/services"
	"github.com/PhamVanBinh321/URL-Shortener-Service/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// AuthHandler handles authentication requests
type AuthHandler struct {
	authService *services.AuthService
	validate    *validator.Validate
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validate:    validator.New(),
	}
}

// Register handles user registration
// @Summary Register a new user
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body models.UserRegisterRequest true "Registration request"
// @Success 201 {object} utils.Response
// @Router /api/auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.UserRegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Validate request
	if err := h.validate.Struct(req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Register user
	user, err := h.authService.Register(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	// Generate token
	token, err := h.authService.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate token", err.Error())
		return
	}

	// Return response
	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Login handles user login
// @Summary Login
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body models.UserLoginRequest true "Login request"
// @Success 200 {object} utils.Response
// @Router /api/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.UserLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Validate request
	if err := h.validate.Struct(req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	// Login user
	token, user, err := h.authService.Login(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	// Return response
	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// GetCurrentUser handles getting current user info
// @Summary Get current user
// @Tags Authentication
// @Produce json
// @Success 200 {object} utils.Response
// @Security BearerAuth
// @Router /api/auth/me [get]
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not authenticated")
		return
	}

	user, err := h.authService.GetUserByID(userID)
	if err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", user.ToResponse())
}
