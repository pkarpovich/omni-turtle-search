package services

import (
	"context"
	"github.com/go-pkgz/syncs"
	"github.com/pkarpovich/omni-turtle-search/app/services/provider"
	"log"
)

type ProviderSearchItem struct {
	Id          string `json:"id"`
	Url         string `json:"url"`
	Title       string `json:"title"`
	Description string `json:"description"`
	UpdateTime  int64  `json:"updateTime"`
}

type ProviderSearchResponse struct {
	Items        []ProviderSearchItem `json:"items"`
	ProviderName string               `json:"providerName"`
	Error        string               `json:"error,omitempty"`
}

type Provider interface {
	Search(query string, metadata *provider.Metadata) (*ProviderSearchResponse, error)
	GetName() string
}

type MultiSearch []Provider

func (ms MultiSearch) Search(query string, metadata *provider.Metadata) ([]*ProviderSearchResponse, error) {
	wg := syncs.NewSizedGroup(4)

	responses := make(chan *ProviderSearchResponse, len(ms))

	for _, p := range ms {
		wg.Go(func(context.Context) {
			resp, err := p.Search(query, metadata)
			if err != nil {
				log.Printf("[ERROR] Search error: %v", err)

				resp = &ProviderSearchResponse{
					Items:        make([]ProviderSearchItem, 0),
					ProviderName: p.GetName(),
					Error:        err.Error(),
				}
			}

			responses <- resp
		})
	}

	go func() {
		wg.Wait()
		close(responses)
	}()

	providerResponses := make([]*ProviderSearchResponse, 0)
	for resp := range responses {
		providerResponses = append(providerResponses, resp)
	}

	return providerResponses, nil
}
