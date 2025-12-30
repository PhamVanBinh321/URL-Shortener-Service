package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null;size:255" json:"email" validate:"required,email"`
	PasswordHash string    `gorm:"not null;size:255" json:"-"`
	Name         string    `gorm:"size:255" json:"name"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	URLs []URL `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"urls,omitempty"`
}

// TableName specifies the table name for User model
func (User) TableName() string {
	return "users"
}

// UserRegisterRequest represents the registration request
type UserRegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Name     string `json:"name" validate:"required"`
}

// UserLoginRequest represents the login request
type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// UserResponse represents the user response (without password)
type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Name:      u.Name,
		CreatedAt: u.CreatedAt,
	}
}
