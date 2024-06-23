package logseq

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
)

const Url = "http://127.0.0.1:12315/api"

type Client struct {
	config config.LogseqConfig
	name   string
}

func NewClient(cfg config.LogseqConfig) *Client {
	return &Client{
		config: cfg,
		name:   "logseq",
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

func (c *Client) Search(query string) (*services.ProviderSearchResponse, error) {
	var searchResp SearchResponse
	if err := executeRequest("logseq.App.search", []string{fmt.Sprintf("[%s]", query)}, &searchResp); err != nil {
		return nil, err
	}

	items := make([]services.ProviderSearchItem, 0, len(searchResp.Blocks))

	for _, block := range searchResp.Blocks {
		page, err := c.getPage(block.PageId)
		if err != nil {
			log.Printf("[ERROR] Error while getting page: %v", err)
			continue
		}

		items = append(items, services.ProviderSearchItem{
			Id:          block.Id,
			Url:         fmt.Sprintf("logseq://graph/%s?block-id=%s", c.config.Workspace, block.Id),
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

func (c *Client) getPage(id int64) (*Page, error) {
	var page Page

	if err := executeRequest("logseq.Editor.getPage", []int64{id}, &page); err != nil {
		return nil, err
	}

	return &page, nil
}

func executeRequest[T any, N any](method string, args []N, result T) error {
	httpClient := &http.Client{}

	reqBody := RequestBody[N]{
		Method: method,
		Args:   args,
	}
	body, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", Url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer test")

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

func removeSpecialChars(input string) string {

	replacer := strings.NewReplacer(
		"\n", "",
		"\t", "",
	)

	cleaned := replacer.Replace(input)

	pattern := regexp.MustCompile(`\$\S+?\$`)
	cleaned = pattern.ReplaceAllString(cleaned, "")

	return cleaned
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
