FROM golang:1.25-alpine AS builder
RUN apk add --no-cache git ca-certificates
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /app ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata \
    && addgroup -g 1001 -S appgroup \
    && adduser -u 1001 -S appuser -G appgroup
COPY --from=builder /app /usr/local/bin/app
USER appuser:appgroup
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:8080/health || exit 1
ENTRYPOINT ["app"]
