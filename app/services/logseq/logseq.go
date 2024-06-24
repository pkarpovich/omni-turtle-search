package logseq

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"github.com/pkarpovich/omni-turtle-search/app/services/provider"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
)

const Url = "http://127.0.0.1:12315/api"

type Client struct {
	name string
}

func NewClient() *Client {
	return &Client{
		name: "logseq",
	}
}

func (c *Client) GetName() string {
	return c.name
}

type RequestBody[T any] struct {
	Method string `json:"method"`
	Args   []T    `json:"args"`
}

type Block struct {
	Id      string `json:"block/uuid"`
	Content string `json:"block/content"`
	PageId  int64  `json:"block/page"`
}

type Page struct {
	Id        string `json:"uuid"`
	Name      string `json:"originalName"`
	CreatedAt int64  `json:"createdAt"`
}

type PageContent struct {
	Id      string `json:"block/uuid"`
	Content string `json:"block/snippet"`
}

type SearchResponse struct {
	Blocks      []Block       `json:"blocks"`
	PageContent []PageContent `json:"pages-content"`
	Pages       []string      `json:"pages"`
}

type SearchRequest[T any] struct {
	metadata provider.LogseqMetadata
	method   string
	args     []T
}

func (c *Client) Search(query string, metadata *provider.Metadata) (*services.ProviderSearchResponse, error) {
	var searchResp SearchResponse
	if err := executeRequest(SearchRequest[string]{
		args:     []string{fmt.Sprintf("[%s]", query)},
		method:   "logseq.Search.search",
		metadata: metadata.Logseq,
	}, &searchResp); err != nil {
		return nil, err
	}

	items := make([]services.ProviderSearchItem, 0, len(searchResp.Blocks))

	for _, block := range searchResp.Blocks {
		page, err := c.getPage(block.PageId, metadata.Logseq)
		if err != nil {
			log.Printf("[ERROR] Error while getting page: %v", err)
			continue
		}

		items = append(items, services.ProviderSearchItem{
			Id:          block.Id,
			Url:         fmt.Sprintf("logseq://graph/%s?block-id=%s", metadata.Logseq.Workspace, block.Id),
			Title:       page.Name,
			Description: cleanString(block.Content),
			UpdateTime:  page.CreatedAt,
		})
	}

	return &services.ProviderSearchResponse{
		Items:        items,
		ProviderName: c.GetName(),
	}, nil
}

func (c *Client) getPage(id int64, meta provider.LogseqMetadata) (*Page, error) {
	var page Page

	if err := executeRequest(SearchRequest[int64]{
		method:   "logseq.Editor.getPage",
		args:     []int64{id},
		metadata: meta,
	}, &page); err != nil {
		return nil, err
	}

	return &page, nil
}

func executeRequest[T any, N any](request SearchRequest[N], result T) error {
	httpClient := &http.Client{}

	reqBody := RequestBody[N]{
		Method: request.method,
		Args:   request.args,
	}
	body, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", request.metadata.Url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", request.metadata.Token))

	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}

	defer func() {
		if err := resp.Body.Close(); err != nil {
			fmt.Printf("[ERROR] Error while closing response body: %v", err)
		}
	}()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return err
	}

	return nil
}

func cleanString(content string) string {
	if content == "" {
		return ""
	}

	patterns := []string{
		`\n`,                                // Remove newlines
		`\t`,                                // Remove tabs
		`\$pfts_2lqh>\$(.*?)\$<pfts_2lqh\$`, // Clean highlight
		`!\[.*?\]\(\.\.\/assets.*?\)`,       // Remove images
		`^[\w-]+::.*?$`,                     // Clean properties
		`{{renderer .*?}}`,                  // Clean renderer
		`^deadline: <.*?>$`,                 // Clean deadline
		`^scheduled: <.*?>$`,                // Clean schedule
		`^:logbook:[\S\s]*?:end:`,           // Clean logbook
		`^:LOGBOOK:[\S\s]*?:END:`,           // Clean logbook
		`{{video .*?}}`,                     // Remove video
		`^\s*?-\s*?$`,                       // Remove empty list items
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		content = re.ReplaceAllString(content, "")
	}

	return strings.TrimSpace(content)
}
