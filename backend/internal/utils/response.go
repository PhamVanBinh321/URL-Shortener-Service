package utils

import (
	"github.com/gin-gonic/gin"
)

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Success    bool        `json:"success"`
	Message    string      `json:"message,omitempty"`
	Data       interface{} `json:"data"`
	Pagination Pagination  `json:"pagination"`
}

// Pagination represents pagination metadata
type Pagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// SuccessResponse sends a success response
func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, statusCode int, message string, err interface{}) {
	c.JSON(statusCode, Response{
		Success: false,
		Message: message,
		Error:   err,
	})
}

// PaginatedSuccessResponse sends a paginated success response
func PaginatedSuccessResponse(c *gin.Context, statusCode int, message string, data interface{}, page, limit int, total int64) {
	totalPages := int(total) / limit
	if int(total)%limit != 0 {
		totalPages++
	}

	c.JSON(statusCode, PaginatedResponse{
		Success: true,
		Message: message,
		Data:    data,
		Pagination: Pagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

// ValidationErrorResponse sends a validation error response
func ValidationErrorResponse(c *gin.Context, errors interface{}) {
	ErrorResponse(c, 400, "Validation failed", errors)
}

// UnauthorizedResponse sends an unauthorized response
func UnauthorizedResponse(c *gin.Context, message string) {
	ErrorResponse(c, 401, message, nil)
}

// ForbiddenResponse sends a forbidden response
func ForbiddenResponse(c *gin.Context, message string) {
	ErrorResponse(c, 403, message, nil)
}

// NotFoundResponse sends a not found response
func NotFoundResponse(c *gin.Context, message string) {
	ErrorResponse(c, 404, message, nil)
}

// InternalServerErrorResponse sends an internal server error response
func InternalServerErrorResponse(c *gin.Context, message string, err interface{}) {
	ErrorResponse(c, 500, message, err)
}
