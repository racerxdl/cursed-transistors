package main

import (
	"encoding/json"
	"fmt"
	"github.com/alecthomas/kong"
	"io/fs"
	"io/ioutil"
	"path"
	"strings"
)

var CLI struct {
	Folder string `arg:"" name:"path" help:"Folder with json files to migrate"`
}

type TrAttribute struct {
	Name     string
	Unit     string
	Value    float32
	Range    [2]float32
	Decimals int
}

type TrAttrCollection [4]TrAttribute

func (t TrAttrCollection) ToOpenSea() [4]OpenSeaNumberAttribute {
	return [4]OpenSeaNumberAttribute{
		t[0].ToOpenSea(),
		t[1].ToOpenSea(),
		t[2].ToOpenSea(),
		t[3].ToOpenSea(),
	}
}

func (tr TrAttribute) ToOpenSea() OpenSeaNumberAttribute {
	return OpenSeaNumberAttribute{
		TraitType:   tr.Name,
		DisplayType: "number",
		MaxValue:    tr.Range[1],
		MinValue:    tr.Range[0],
		Value:       tr.Value,
		Unit:        tr.Unit,
	}
}

type OpenSeaNumberAttribute struct {
	TraitType   string  `json:"trait_type"`
	Value       float32 `json:"value"`
	DisplayType string  `json:"display_type,omitempty"`
	MaxValue    float32 `json:"max_value,omitempty"`
	MinValue    float32 `json:"min_value,omitempty"`
	Unit        string  `json:"unit,omitempty"`
}

type OpenSeaStringAttribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

type OpenSeaNFT struct {
	// ERC721Metadata Fields
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`

	// Cursed Transistor Fields
	CTAttributes    TrAttrCollection `json:"ct_attributes"`
	Attributes      []interface{}    `json:"attributes"`       // Transistor Attributes
	BackgroundColor string           `json:"background_color"` // Base color used for transistor coloring
}

type NFTMeta struct {
	// ERC721Metadata Fields
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`

	// Cursed Transistor Fields
	CTAttributes   *TrAttrCollection `json:"ct_attributes"`             // Only for validating already migrated
	Attributes     TrAttrCollection  `json:"attributes"`                // Transistor Attributes
	Special        bool              `json:"special"`                   // If this NFT was a special reward from Teske's Lab and friends
	SpecialMessage *string           `json:"special_message,omitempty"` // Message from special reward. Only when Special == true
	EarlyAdopter   bool              `json:"early_adopter"`             // If this NFT was minted for an early adopter
	BaseColor      string            `json:"base_color"`                // Base color used for transistor coloring
	Transistor     string            `json:"transistor"`                // Transistor Type
	Variant        string            `json:"variant"`                   // Transistor Variant
}

func (m NFTMeta) ToOpenSea() OpenSeaNFT {
	ott := m.Attributes.ToOpenSea()

	attrs := make([]interface{}, 0)
	for _, v := range ott {
		attrs = append(attrs, v)
	}
	attrs = append(attrs, OpenSeaStringAttribute{
		TraitType: "Transistor",
		Value:     m.Transistor,
	})
	attrs = append(attrs, OpenSeaStringAttribute{
		TraitType: "Variant",
		Value:     m.Variant,
	})

	special := "no"
	if m.Special {
		special = "yes"
	}

	attrs = append(attrs, OpenSeaStringAttribute{
		TraitType: "Special",
		Value:     special,
	})
	if m.SpecialMessage != nil {
		attrs = append(attrs, OpenSeaStringAttribute{
			TraitType: "Special Message",
			Value:     *m.SpecialMessage,
		})
	}

	earlyAdopter := "no"
	if m.EarlyAdopter {
		earlyAdopter = "yes"
	}
	attrs = append(attrs, OpenSeaStringAttribute{
		TraitType: "Early Adopter",
		Value:     earlyAdopter,
	})

	return OpenSeaNFT{
		Name:            m.Name,
		Description:     m.Description,
		Image:           m.Image,
		Attributes:      attrs,
		CTAttributes:    m.Attributes,
		BackgroundColor: m.BaseColor[1:],
	}
}

func main() {
	_ = kong.Parse(&CLI)
	files, err := ioutil.ReadDir(CLI.Folder)
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		name := file.Name()
		filepath := path.Join(CLI.Folder, name)
		if !file.IsDir() && len(name) > 5 && strings.EqualFold(name[len(name)-5:], ".json") {
			fmt.Printf("migrating %s\n", filepath)
			m := NFTMeta{}
			data, err := ioutil.ReadFile(filepath)
			if err != nil {
				panic(err)
			}
			err = json.Unmarshal(data, &m)
			if err != nil {
				panic(err)
			}
			if m.CTAttributes != nil {
				fmt.Printf("File %s already migrated. Skipping...\n", name)
			} else {
				opensea, _ := json.Marshal(m.ToOpenSea())
				err = ioutil.WriteFile(filepath, opensea, fs.ModePerm)
				if err != nil {
					panic(err)
				}
			}
		}
	}
}
