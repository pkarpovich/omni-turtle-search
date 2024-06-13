package services

import (
	"context"
	"github.com/go-pkgz/syncs"
	"log"
)

type ProviderSearchResponse struct {
	Id          string
	Url         string
	Title       string
	Description string
}

type Provider interface {
	Search(query string) ([]ProviderSearchResponse, error)
}

type MultiSearch []Provider

func (ms MultiSearch) Search(query string) ([]ProviderSearchResponse, error) {
	wg := syncs.NewSizedGroup(4)

	responses := make(chan []ProviderSearchResponse, len(ms))

	for _, provider := range ms {
		wg.Go(func(context.Context) {
			items, err := provider.Search(query)
			if err != nil {
				log.Printf("[ERROR] Search error: %v", err)
			}

			responses <- items
		})
	}

	go func() {
		wg.Wait()
		close(responses)
	}()

	var allItems []ProviderSearchResponse
	for items := range responses {
		allItems = append(allItems, items...)
	}

	return allItems, nil
}
