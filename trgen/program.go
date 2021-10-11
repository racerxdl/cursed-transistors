package main

import (
	"fmt"
	"github.com/alecthomas/kong"
	"math/rand"
	"path"
	"time"
)

var CLI struct {
	Special struct {
		TestNet        bool   `name:"testnet" help:"If set, emits for testnet"`
		OutputFolder   string `arg:"" name:"path" help:"Output folder to save the file(s)"`
		Number         int    `arg:"" name:"tokenID" help:"TokenID"`
		SpecialMessage string `arg:"" name:"message" help:"Message for the special NFT"`
	} `cmd:"" help:"Generate a special NFT"`
	Common struct {
		TestNet      bool   `name:"testnet" help:"If set, emits for testnet"`
		EarlyAdopter bool   `name:"early-adopter" help:"If set, emits NFT with early adopter flag"`
		OutputFolder string `arg:"" name:"path" help:"Output folder to save the file(s)"`
		RangeStart   int    `arg:"" help:"Start range for the tokenID"`
		RangeEnd     int    `arg:"" help:"End range for the tokenID"`
	} `cmd:"" help:"Generate a common NFT"`
}

func main() {
	rand.Seed(time.Now().UnixNano())

	ctx := kong.Parse(&CLI)
	switch ctx.Command() {
	case "special <path> <tokenID> <message>":
		runSpecial()
	case "common <path> <range-start> <range-end>":
		runCommon()
	default:
		_ = ctx.PrintUsage(true)
		return
	}
}

func runSpecial() {
	url := baseUrl
	if CLI.Special.TestNet {
		url = baseTestNetURL
	}
	img, data := generateN(CLI.Special.Number, true, false, CLI.Special.SpecialMessage, url)
	imgFilename := path.Join(CLI.Special.OutputFolder, fmt.Sprintf("%d.jpg", CLI.Special.Number))
	jsonFilename := path.Join(CLI.Special.OutputFolder, fmt.Sprintf("%d.json", CLI.Special.Number))

	err := saveImage(img, imgFilename)
	if err != nil {
		panic(err)
	}

	err = saveMetadata(*data, jsonFilename)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Image saved to %q\nMetadata saved to %q\n", imgFilename, jsonFilename)
}

func runCommon() {
	url := baseUrl
	if CLI.Common.TestNet {
		url = baseTestNetURL
	}

	for i := CLI.Common.RangeStart; i < CLI.Common.RangeEnd; i++ {
		img, data := generateN(i, false, CLI.Common.EarlyAdopter, "", url)
		imgFilename := path.Join(CLI.Common.OutputFolder, fmt.Sprintf("%d.jpg", i))
		jsonFilename := path.Join(CLI.Common.OutputFolder, fmt.Sprintf("%d.json", i))

		err := saveImage(img, imgFilename)
		if err != nil {
			panic(err)
		}

		err = saveMetadata(*data, jsonFilename)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Generated %q\n", imgFilename)
	}
}
