package notion

import (
	"context"
	"github.com/jomei/notionapi"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"github.com/pkarpovich/omni-turtle-search/app/services/provider"
	"log"
)

type Client struct {
	config config.NotionConfig
	name   string
	client *notionapi.Client
}

func NewClient(cfg config.NotionConfig) *Client {
	client := notionapi.NewClient(notionapi.Token(cfg.Token))

	return &Client{
		config: cfg,
		client: client,
		name:   "notion",
	}
}

func (c *Client) GetName() string {
	return c.name
}

func (c *Client) Search(query string, _ *provider.Metadata) (*services.ProviderSearchResponse, error) {
	resp, err := c.client.Search.Do(context.Background(), &notionapi.SearchRequest{
		Query: query,
		Sort: &notionapi.SortObject{
			Direction: "ascending",
			Timestamp: "last_edited_time",
		},
		Filter: notionapi.SearchFilter{
			Value:    "database",
			Property: "object",
		},
	})
	if err != nil {
		return nil, err
	}

	items := make([]services.ProviderSearchItem, 0, len(resp.Results))
	for _, result := range resp.Results {
		db, ok := result.(*notionapi.Database)
		if !ok {
			log.Printf("[ERROR] Unexpected search result type: %T", result)
			continue
		}

		item := services.ProviderSearchItem{
			Id:          db.ID.String(),
			Url:         db.URL,
			Title:       db.Title[0].PlainText,
			Description: "",
			UpdateTime:  db.LastEditedTime.UnixMilli(),
		}
		items = append(items, item)
	}

	return &services.ProviderSearchResponse{
		Items:        items,
		ProviderName: c.GetName(),
	}, nil
}
