package http

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"github.com/pkarpovich/omni-turtle-search/app/services/provider"
	"github.com/rs/cors"
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
	mux.HandleFunc("POST /search", hc.searchHandler)
	mux.HandleFunc("POST /search-stream", hc.searchStreamHandler)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", hc.config.Port),
		Handler: cors.Default().Handler(mux),
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
	Query string             `json:"query"`
	Meta  *provider.Metadata `json:"metadata"`
}

type SearchResponse struct {
	Items        []services.ProviderSearchItem `json:"items"`
	ProviderName string                        `json:"providerName"`
}

func (hc *Client) searchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req SearchRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	resp, err := hc.multiSearch.Search(req.Query, req.Meta)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Printf("[ERROR] Failed to write response: %v", err)
	}
}

type StreamSearchResponse struct {
	Data    *services.ProviderSearchResponse `json:"data"`
	HasMore bool                             `json:"hasMore"`
}

func (hc *Client) searchStreamHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	var req SearchRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	resultChan := hc.multiSearch.SearchStream(req.Query, req.Meta)
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	writeResponse := func(data *services.ProviderSearchResponse, hasMore bool) error {
		response := &StreamSearchResponse{
			Data:    data,
			HasMore: hasMore,
		}

		respData, err := json.Marshal(response)
		if err != nil {
			return fmt.Errorf("failed to marshal response: %w", err)
		}

		_, err = fmt.Fprintf(w, "data: %s\n\n", respData)
		if err != nil {
			return fmt.Errorf("failed to write response: %w", err)
		}

		flusher.Flush()
		return nil
	}

	for {
		select {
		case <-ctx.Done():
			log.Printf("[INFO] Client disconnected")
			return
		case providerResp, ok := <-resultChan:
			if !ok {
				if err := writeResponse(nil, false); err != nil {
					log.Printf("[ERROR] %v", err)
				}
				return
			}

			if err := writeResponse(providerResp, true); err != nil {
				log.Printf("[ERROR] %v", err)
			}
		}
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
