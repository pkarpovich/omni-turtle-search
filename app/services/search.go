package services

import (
	"context"
	"github.com/go-pkgz/syncs"
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
}

type Provider interface {
	Search(query string) (*ProviderSearchResponse, error)
}

type MultiSearch []Provider

func (ms MultiSearch) Search(query string) ([]*ProviderSearchResponse, error) {
	wg := syncs.NewSizedGroup(4)

	responses := make(chan *ProviderSearchResponse, len(ms))

	for _, provider := range ms {
		wg.Go(func(context.Context) {
			resp, err := provider.Search(query)
			if err != nil {
				log.Printf("[ERROR] Search error: %v", err)
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
