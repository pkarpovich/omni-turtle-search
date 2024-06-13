package http

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type Client struct {
	config      config.HttpConfig
	multiSearch services.MultiSearch
}

func CreateClient(cfg config.HttpConfig, multiSearch services.MultiSearch) *Client {
	return &Client{
		multiSearch: multiSearch,
		config:      cfg,
	}
}

func (hc *Client) Start() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", hc.healthHandler)
	mux.HandleFunc("GET /search", hc.searchHandler)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", hc.config.Port),
		Handler: mux,
	}

	go func() {
		log.Printf("[INFO] Starting HTTP server on %s", server.Addr)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Printf("[ERROR] HTTP server error: %v", err)
		}
		log.Printf("[INFO] HTTP server stopped")
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownRelease()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("[ERROR] HTTP server error: %v", err)
	}
	log.Printf("[INFO] HTTP server shutdown")
}

type SearchRequest struct {
	Query string `json:"query"`
}

type SearchResponse struct {
	Items []services.ProviderSearchResponse `json:"data"`
}

func (hc *Client) searchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req SearchRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	items, err := hc.multiSearch.Search(req.Query)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respBody := &SearchResponse{Items: items}

	err = json.NewEncoder(w).Encode(respBody)
	if err != nil {
		log.Printf("[ERROR] Failed to write response: %v", err)
	}
}

type HealthResponse struct {
	Ok bool `json:"ok"`
}

func (hc *Client) healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	respBody := &HealthResponse{Ok: true}

	err := json.NewEncoder(w).Encode(respBody)
	if err != nil {
		log.Printf("[ERROR] Failed to write response: %v", err)
	}
}
