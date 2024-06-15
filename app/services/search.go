package services

import (
	"context"
	"github.com/go-pkgz/syncs"
	"log"
	"slices"
)

type ProviderSearchResponse struct {
	Id          string `json:"id"`
	Url         string `json:"url"`
	Title       string `json:"title"`
	Description string `json:"description"`
	UpdateTime  int64  `json:"updateTime"`
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

	allItems := make([]ProviderSearchResponse, 0)
	for items := range responses {
		allItems = append(allItems, items...)
	}

	slices.SortFunc(allItems, func(i, j ProviderSearchResponse) int {
		if i.UpdateTime > j.UpdateTime {
			return -1
		}

		if i.UpdateTime < j.UpdateTime {
			return 1
		}

		return 0
	})

	return allItems, nil
}
