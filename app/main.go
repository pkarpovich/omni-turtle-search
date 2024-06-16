package main

import (
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/http"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"github.com/pkarpovich/omni-turtle-search/app/services/cubox"
	"github.com/pkarpovich/omni-turtle-search/app/services/todoist"
	"log"
)

func main() {
	cfg, err := config.Init()
	if err != nil {
		log.Printf("[ERROR] Something went wrong: %v", err)
	}

	cuboxClient := cubox.NewClient(cfg.Cubox)
	todoistClient := todoist.NewClient(cfg.Todoist)

	multiSearch := services.MultiSearch{
		cuboxClient,
		todoistClient,
	}

	http.CreateClient(cfg.Http, multiSearch).Start()
}
