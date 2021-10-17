package main

import (
	"fmt"
	"github.com/llgcode/draw2d"
	"github.com/llgcode/draw2d/draw2dimg"
	"github.com/nfnt/resize"
	"image"
	"image/color"
	"image/draw"
	"math/rand"
)

func generateN(n int, special, earlyAdopter bool, specialMessage, baseUrl string) (*image.RGBA, *NFTMeta) {
	reseed()

	// Shuffle color list
	rand.Shuffle(len(bgColors), func(i, j int) {
		bgColors[i], bgColors[j] = bgColors[j], bgColors[i]
	})

	// Pick color
	bgBase := bgColors[randInt(len(bgColors))]
	// Pick type
	transistor := randInt(4)
	// Pick variant
	variant := randInt(2)

	// Generate attributes
	attrs := [4]TrAttribute{}
	for i := 0; i < 4; i++ {
		attrs[i] = trAttrs[transistor][i]
		v := randFloatRange(attrs[i].Range[0], attrs[i].Range[1])
		attrs[i].Value = roundCases(v, attrs[i].Decimals)
	}
	// Copy bases
	baseCopy := cloneImage(baseImage)
	bodyCopy := cloneImage(bodyImage)

	// Color Background
	for y := 0; y < 32; y++ {
		for x := 0; x < 64; x++ {
			c := baseCopy.At(x, y)
			for _, bg := range picBgLevels {
				if bg == c {
					baseCopy.Set(x, y, adjustValue(bg, bgBase))
					break
				}
			}
		}
	}

	// Color Foreground
	trx := variant * 32
	try := transistor * 32
	for y := try; y < try+32; y++ {
		for x := trx; x < trx+32; x++ {
			c := bodyCopy.At(x, y)
			for _, fg := range picTrLevels {
				if fg == c {
					bodyCopy.Set(x, y, adjustValueFg(fg, bgBase))
					break
				}
			}
		}
	}

	// Fill NFT Metadata
	name := fmt.Sprintf("%s %s", trVariants[transistor][variant], trNames[transistor])
	nftData := &NFTMeta{}
	nftData.Name = name
	nftData.Attributes = attrs
	nftData.BaseColor = fmt.Sprintf("#%02x%02x%02x", bgBase.R, bgBase.G, bgBase.B)
	nftData.Transistor = trNames[transistor]
	nftData.Variant = trVariants[transistor][variant]
	nftData.Description = fmt.Sprintf("A cursed %s", name)
	nftData.Description += "\n"
	for _, v := range attrs {
		decimals := fmt.Sprintf("%d", v.Decimals)
		fmtStr := "\n%s: %." + decimals + "f %s"
		nftData.Description += fmt.Sprintf(fmtStr, v.Name, v.Value, v.Unit)
	}
	nftData.Image = fmt.Sprintf("%s/img/trx/%d.jpg", baseUrl, n)

	if special {
		nftData.Special = true
		nftData.SpecialMessage = &specialMessage
	}
	nftData.EarlyAdopter = earlyAdopter

	// Generate Image
	cursed := image.NewRGBA(image.Rect(0, 0, 32, 32))
	draw.Draw(cursed, image.Rect(0, 0, 32, 32), baseCopy, image.Pt(0, 0), draw.Over)
	draw.Draw(cursed, image.Rect(0, 0, 32, 32), baseCopy, image.Pt(32, 0), draw.Over)
	draw.Draw(cursed, image.Rect(0, 0, 32, 32), bodyCopy, image.Pt(trx, try), draw.Over)

	cursedI := resize.Resize(768, 768, cursed, resize.NearestNeighbor)
	o := image.NewRGBA(image.Rect(0, 0, 1024, 1024))
	bgColor := cursedI.At(0, 0)

	dc := draw2dimg.NewGraphicContext(o)
	dc.SetFontData(draw2d.FontData{
		Name:   "LcdSolid",
		Family: draw2d.FontFamilyMono,
		Style:  draw2d.FontStyleNormal,
	})

	dc.SetFillColor(bgColor)
	dc.Clear()

	draw.Draw(o, image.Rect(128, 128, 960, 960), cursedI, image.Pt(0, 0), draw.Over)
	if special {
		drawBorder(1024, 1024, silverBorderPalette, dc)
	} else if earlyAdopter {
		drawBorder(1024, 1024, goldBorderPalette, dc)
	}
	dc.SetFillColor(color.White)
	dc.SetFontSize(64)
	dc.FillStringAt(name, 64, 128)

	vmax := fmt.Sprintf("%.0f%s", attrs[0].Value, attrs[0].Unit)
	imax := fmt.Sprintf("%.0f%s", attrs[1].Value, attrs[1].Unit)
	tOn := fmt.Sprintf("%.0f%s", attrs[2].Value, attrs[2].Unit)

	vmaxWidth := getWidth(dc, vmax)
	imaxWidth := getWidth(dc, imax)

	dc.FillStringAt(vmax, 1024-vmaxWidth-64, 128)
	dc.FillStringAt(imax, 1024-imaxWidth-64, 1024-64)
	dc.FillStringAt(tOn, 64, 1024-64)

	return o, nftData
}
