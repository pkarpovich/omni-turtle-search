package main

import (
	"github.com/pkarpovich/omni-turtle-search/app/config"
	"github.com/pkarpovich/omni-turtle-search/app/http"
	"github.com/pkarpovich/omni-turtle-search/app/services"
	"github.com/pkarpovich/omni-turtle-search/app/services/cubox"
	"log"
)

func main() {
	cfg, err := config.Init()
	if err != nil {
		log.Printf("[ERROR] Something went wrong: %v", err)
	}

	cuboxClient := cubox.NewClient(cfg.Cubox)

	multiSearch := services.MultiSearch{
		cuboxClient,
	}

	http.CreateClient(cfg.Http, multiSearch).Start()

	resp, err := cuboxClient.Search("golang")
	if err != nil {
		log.Printf("[ERROR] Something went wrong: %v", err)
	}

	log.Printf("[INFO] Response: %v", resp)
}
