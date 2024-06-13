package cubox

import (
	"encoding/json"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"io"
	"net/http"
)

type Client struct {
	config config.CuboxConfig
}

func NewClient(cfg config.CuboxConfig) *Client {
	return &Client{
		config: cfg,
	}
}

type SearchResponse struct {
	Items []SearchResponseItem `json:"data"`
}

type SearchResponseItem struct {
	Id          string `json:"userSearchEngineID"`
	Url         string `json:"targetURL"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func (c *Client) Search(query string) ([]services.ProviderSearchResponse, error) {
	httpClient := &http.Client{}

	url := c.buildSearchURL(query)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", c.config.Token)

	bodyResp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer bodyResp.Body.Close()

	var searchResp SearchResponse
	body, err := io.ReadAll(bodyResp.Body)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(body, &searchResp); err != nil {
		return nil, err
	}

	items := make([]services.ProviderSearchResponse, 0, len(searchResp.Items))
	for _, item := range searchResp.Items {
		items = append(items, services.ProviderSearchResponse{
			Id:          item.Id,
			Url:         item.Url,
			Title:       item.Title,
			Description: item.Description,
		})
	}

	return items, nil
}

func (c *Client) buildSearchURL(query string) string {
	return fmt.Sprintf("https://cubox.cc/c/api/card/search?page=1&pageSize=50&keyword=%s&filters=&archiving=false", query)
}
