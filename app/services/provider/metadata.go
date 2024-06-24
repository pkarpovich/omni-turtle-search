package provider

type LogseqMetadata struct {
	Url       string `json:"url"`
	Token     string `json:"token"`
	Workspace string `json:"workspace"`
}

type Metadata struct {
	Logseq LogseqMetadata `json:"logseq"`
}
