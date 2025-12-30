package utils

import (
	"crypto/rand"
	"encoding/base64"
	"math/big"
)

const (
	// Characters used for short code generation
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

// GenerateShortCode generates a random short code of specified length
func GenerateShortCode(length int) (string, error) {
	result := make([]byte, length)
	charsLen := big.NewInt(int64(len(chars)))

	for i := 0; i < length; i++ {
		randomIndex, err := rand.Int(rand.Reader, charsLen)
		if err != nil {
			return "", err
		}
		result[i] = chars[randomIndex.Int64()]
	}

	return string(result), nil
}

// GenerateRandomString generates a cryptographically secure random string
func GenerateRandomString(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes)[:length], nil
}
