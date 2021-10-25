package main

import (
	"encoding/json"
	"github.com/holiman/uint256"
	"os"
)

// BaseURL for production environment
const baseUrl = "https://cursed-transistors.lucasteske.dev"

// BaseURL for testnet environment
const baseTestNetURL = "https://cursed-transistors-test.lucasteske.dev"

var specialIDPrefix, _ = uint256.FromHex("0x10000000000000000")

// NFTMeta represents the Cursed Transistor NFT JSON Metadata
type NFTMeta struct {
	// ERC721Metadata Fields
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`

	// Cursed Transistor Fields
	Attributes     [4]TrAttribute `json:"attributes"`                // Transistor Attributes
	Special        bool           `json:"special"`                   // If this NFT was a special reward from Teske's Lab and friends
	SpecialMessage *string        `json:"special_message,omitempty"` // Message from special reward. Only when Special == true
	EarlyAdopter   bool           `json:"early_adopter"`             // If this NFT was minted for an early adopter
	BaseColor      string         `json:"base_color"`                // Base color used for transistor coloring
	Transistor     string         `json:"transistor"`                // Transistor Type
	Variant        string         `json:"variant"`                   // Transistor Variant
}

func saveMetadata(data NFTMeta, filename string) error {
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	v, _ := json.Marshal(data)
	_, err = f.Write(v)
	return err
}
