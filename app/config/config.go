package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"log"
)

type CuboxConfig struct {
	Token string `env:"CUBOX_TOKEN"`
}

type TodoistConfig struct {
	Token string `env:"TODOIST_TOKEN"`
}

type NotionConfig struct {
	Token string `env:"NOTION_TOKEN"`
}

type HttpConfig struct {
	Port int `env:"HTTP_PORT" env-default:"8080"`
}

type Config struct {
	Todoist TodoistConfig
	Notion  NotionConfig
	Cubox   CuboxConfig
	Http    HttpConfig
}

func Init() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("[WARN] error while loading .env file: %v", err)
	}

	var cfg Config
	err = cleanenv.ReadEnv(&cfg)
	if err != nil {
		return nil, err
	}

	return &cfg, nil
}
