package main

import (
	"fmt"
	"github.com/alecthomas/kong"
	"io/ioutil"
	"math/rand"
	"path"
	"strconv"
	"strings"
	"time"
)

var CLI struct {
	Kitten struct {
		TestNet      bool   `name:"testnet" help:"If set, emits for testnet"`
		OutputFolder string `arg:"" name:"path" help:"Output folder to save the file(s)"`
		MessageList  string `arg:"" name:"messages" help:"Message list for kittens"`
		Number       int    `arg:"" name:"tokenID" help:"First Token Offset (without the 1 << 64)"`
	} `cmd:"" help:"Generate a airdrop for kittens"`
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
	case "kitten <path> <messages> <tokenID>":
		runKittenAirdrop()
	case "special <path> <tokenID> <message>":
		runSpecial()
	case "common <path> <range-start> <range-end>":
		runCommon()
	default:
		_ = ctx.PrintUsage(true)
		return
	}
}

func runKittenAirdrop() {
	url := baseUrl
	if CLI.Kitten.TestNet {
		url = baseTestNetURL
	}

	messagesData, err := ioutil.ReadFile(CLI.Kitten.MessageList)
	if err != nil {
		panic(err)
	}
	messages := removeEmptyElements(strings.Split(string(messagesData), "\n"))
	shuffleStringSlice(messages)
	fmt.Printf("There are %d messages\n", len(messages))
	currentNumber := specialIDPrefix.Clone()
	currentNumber.AddUint64(currentNumber, uint64(CLI.Kitten.Number))
	fmt.Printf("Starts at ID %s\n", currentNumber.String())
	for i := 0; i < len(messages); i++ {
		n := currentNumber.ToBig().String()
		fmt.Printf("ID: %s -> %s\n", n, messages[i])
		img, data := generateN(n, true, true, messages[i], url)
		imgFilename := path.Join(CLI.Kitten.OutputFolder, fmt.Sprintf("%s.jpg", n))
		jsonFilename := path.Join(CLI.Kitten.OutputFolder, fmt.Sprintf("%s.json", n))
		err := saveImage(img, imgFilename)
		if err != nil {
			panic(err)
		}

		err = saveMetadata(*data, jsonFilename)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Image saved to %q\nMetadata saved to %q\n", imgFilename, jsonFilename)
		currentNumber.AddUint64(currentNumber, uint64(1))
	}
}

func runSpecial() {
	url := baseUrl
	if CLI.Special.TestNet {
		url = baseTestNetURL
	}
	img, data := generateN(strconv.FormatInt(int64(CLI.Special.Number), 10), true, false, CLI.Special.SpecialMessage, url)
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
		img, data := generateN(strconv.FormatInt(int64(i), 10), false, CLI.Common.EarlyAdopter, "", url)
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
