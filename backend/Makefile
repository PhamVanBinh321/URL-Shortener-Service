.PHONY: help run build test clean dev migrate install

# Default target
help:
	@echo "Available commands:"
	@echo "  make run        - Run the application"
	@echo "  make build      - Build the application"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make dev        - Run with live reload (Air)"
	@echo "  make install    - Install dependencies"
	@echo "  make tidy       - Tidy dependencies"

# Run the application
run:
	go run cmd/server/main.go

# Build the application
build:
	go build -o bin/url-shortener cmd/server/main.go

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/
	rm -rf tmp/

# Run with live reload (requires Air)
dev:
	air

# Install Air for live reload
install-air:
	go install github.com/cosmtrek/air@latest

# Install all dependencies
install:
	go mod download
	go mod verify

# Tidy dependencies
tidy:
	go mod tidy

# Format code
fmt:
	go fmt ./...

# Vet code
vet:
	go vet ./...

# Run linter (requires golangci-lint)
lint:
	golangci-lint run
