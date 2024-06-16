package cubox

import (
	"encoding/json"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	config config.CuboxConfig
	name   string
}

func NewClient(cfg config.CuboxConfig) *Client {
	return &Client{
		config: cfg,
		name:   "cubox",
	}
}

type Date struct {
	time.Time
}

func (c *Date) UnmarshalJSON(b []byte) error {
	str := string(b)
	str = str[1 : len(str)-1]

	// Remove the milliseconds part if it exists
	if idx := strings.LastIndex(str, ":"); idx != -1 && len(str)-idx > 3 { // Checks if the part after last colon is longer than 3 (":883Z")
		str = str[:idx] + "Z"
	}

	layout := "2006-01-02T15:04:05Z"
	parsedTime, err := time.Parse(layout, str)
	if err != nil {
		return err
	}

	c.Time = parsedTime
	return nil
}

type SearchResponse struct {
	Items []SearchResponseItem `json:"data"`
}

type SearchResponseItem struct {
	Id          string `json:"userSearchEngineID"`
	Url         string `json:"targetURL"`
	Title       string `json:"title"`
	Description string `json:"description"`
	UpdateTime  Date   `json:"updateTime"`
}

func (c *Client) GetName() string {
	return c.name
}

func (c *Client) Search(query string) (*services.ProviderSearchResponse, error) {
	httpClient := &http.Client{}

	searchURL := c.buildSearchURL(query)
	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", c.config.Token)

	bodyResp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := bodyResp.Body.Close(); err != nil {
			fmt.Printf("[ERROR] Error while closing response body: %v", err)
		}
	}()

	var searchResp SearchResponse
	body, err := io.ReadAll(bodyResp.Body)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(body, &searchResp); err != nil {
		return nil, err
	}

	items := make([]services.ProviderSearchItem, 0, len(searchResp.Items))
	for _, item := range searchResp.Items {
		items = append(items, services.ProviderSearchItem{
			Id:          item.Id,
			Url:         item.Url,
			Title:       item.Title,
			UpdateTime:  item.UpdateTime.UnixMilli(),
			Description: prepareDescription(item.Description),
		})
	}

	resp := &services.ProviderSearchResponse{
		ProviderName: c.GetName(),
		Items:        items,
	}

	return resp, nil
}

func (c *Client) buildSearchURL(query string) string {
	encodedQuery := url.QueryEscape(query)
	return fmt.Sprintf("https://cubox.cc/c/api/search?page=1&pageSize=50&keyword=%s&filters=&archiving=false", encodedQuery)
}

func prepareDescription(description string) string {
	description = strings.ReplaceAll(description, "\n", "")
	description = strings.ReplaceAll(description, "\t", "")

	if len(description) > 200 {
		return description[:200] + "..."
	}

	return description
}
