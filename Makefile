.PHONY: help dev dev-frontend dev-backend build-frontend build-backend test test-backend test-frontend lint lint-backend lint-frontend clean

help:
	@echo "Available targets:"
	@echo "  dev             - Start frontend + backend dev servers"
	@echo "  dev-frontend    - Start frontend dev server"
	@echo "  dev-backend     - Start backend with hot-reload"
	@echo "  build-frontend  - Build frontend for production"
	@echo "  build-backend   - Build backend Docker image"
	@echo "  test            - Run all tests"
	@echo "  lint            - Run all linters"
	@echo "  clean           - Remove build artifacts"

# Development
dev:
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run ./cmd/server

# Build
build-frontend:
	cd frontend && VITE_API_BASE_URL=https://api.freesslcert.net npm run build

build-backend:
	cd backend && docker build -t freesslcert-api:latest .

# Testing
test: test-backend test-frontend

test-backend:
	cd backend && go test ./... -v -race

test-frontend:
	cd frontend && npm test

# Linting
lint: lint-backend lint-frontend

lint-backend:
	cd backend && golangci-lint run ./...

lint-frontend:
	cd frontend && npm run lint

# Cleanup
clean:
	rm -rf frontend/dist frontend/node_modules
	cd backend && rm -f server
