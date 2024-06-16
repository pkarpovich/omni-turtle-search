package todoist

import (
	"encoding/json"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

const TTL = 60 * time.Minute

type SearchResponseItem struct {
	Id          string    `json:"id"`
	Url         string    `json:"url"`
	Title       string    `json:"content"`
	Description string    `json:"description"`
	UpdateTime  time.Time `json:"created_at"`
}

type cacheEntry struct {
	timestamp time.Time
	response  []SearchResponseItem
}

type Client struct {
	config config.TodoistConfig
	name   string
	cache  *cacheEntry
	mutex  sync.Mutex
}

func NewClient(cfg config.TodoistConfig) *Client {
	return &Client{
		config: cfg,
		name:   "todoist",
	}
}

func (c *Client) GetName() string {
	return c.name
}

func (c *Client) Search(query string) (*services.ProviderSearchResponse, error) {
	searchResp, err := c.fetchAllTasks()
	if err != nil {
		return nil, err
	}

	filteredResp := make([]SearchResponseItem, 0)
	for _, item := range searchResp {
		description := strings.ToLower(item.Description)
		queryForSearch := strings.ToLower(query)
		title := strings.ToLower(item.Title)

		if strings.Contains(title, queryForSearch) || strings.Contains(description, queryForSearch) {
			filteredResp = append(filteredResp, item)
		}
	}

	items := make([]services.ProviderSearchItem, 0, len(filteredResp))
	for _, item := range filteredResp {
		items = append(items, services.ProviderSearchItem{
			Id:          item.Id,
			Url:         item.Url,
			Title:       item.Title,
			Description: item.Description,
			UpdateTime:  item.UpdateTime.UnixMilli(),
		})
	}

	return &services.ProviderSearchResponse{
		Items:        items,
		ProviderName: c.name,
	}, nil
}

func (c *Client) fetchAllTasks() ([]SearchResponseItem, error) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	if c.cache != nil && time.Since(c.cache.timestamp) < TTL {
		return c.cache.response, nil
	}

	httpClient := &http.Client{}

	url := "https://api.todoist.com/rest/v2/tasks"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+c.config.Token)

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := resp.Body.Close()
		if err != nil {
			log.Printf("[ERROR] Error while closing response body: %v", err)
		}
	}()

	var searchResp []SearchResponseItem
	if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
		return nil, err
	}

	c.cache = &cacheEntry{
		timestamp: time.Now(),
		response:  searchResp,
	}

	return searchResp, nil
}
