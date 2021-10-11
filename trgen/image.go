package main

import (
	"bytes"
	"github.com/golang/freetype/truetype"
	"github.com/llgcode/draw2d"
	"github.com/llgcode/draw2d/draw2dimg"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"log"
	"os"
)

var baseImage *image.RGBA
var bodyImage *image.RGBA

func init() {
	// Load LcdSolid font
	fontBytes := MustAsset("assets/LcdSolid.ttf")
	loadedFont, err := truetype.Parse(fontBytes)
	if err != nil {
		panic(err)
	}
	draw2d.RegisterFont(draw2d.FontData{
		Name:   "LcdSolid",
		Family: draw2d.FontFamilyMono,
		Style:  draw2d.FontStyleNormal,
	}, loadedFont)

	// Load base Image
	loadBase()

	// Load body Image
	loadBody()
}

func loadBase() {
	base := MustAsset("assets/base.png")
	// decode jpeg into image.Image
	img, err := png.Decode(bytes.NewReader(base))
	if err != nil {
		log.Fatal(err)
	}

	baseImage = image.NewRGBA(img.Bounds())
	draw.Draw(baseImage, img.Bounds(), img, image.Pt(0, 0), draw.Over)
}

func loadBody() {
	base := MustAsset("assets/body.png")
	// decode jpeg into image.Image
	img, err := png.Decode(bytes.NewReader(base))
	if err != nil {
		log.Fatal(err)
	}

	bodyImage = image.NewRGBA(img.Bounds())
	draw.Draw(bodyImage, img.Bounds(), img, image.Pt(0, 0), draw.Over)
}

// getWidth returns the width in pixels of the specified string
func getWidth(dc *draw2dimg.GraphicContext, str string) float64 {
	left, _, right, _ := dc.GetStringBounds(str)
	return right - left
}

// cloneImage create a new copy of the specified image
func cloneImage(img *image.RGBA) *image.RGBA {
	baseCopy := &image.RGBA{
		Rect:   img.Rect,
		Pix:    make([]byte, len(img.Pix)),
		Stride: img.Stride,
	}
	copy(baseCopy.Pix, img.Pix)
	return baseCopy
}

func saveImage(img *image.RGBA, path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	err = jpeg.Encode(f, img, &jpeg.Options{
		Quality: 90,
	})

	return err
}

func drawBorder(width, height int, palette []color.RGBA, dc *draw2dimg.GraphicContext) {
	w := float64(width)
	h := float64(height)
	dc.Save()
	for i, c := range palette {
		o := float64(i) + 2
		dc.BeginPath()
		dc.MoveTo(o, o)
		dc.LineTo(w-o, o)
		dc.LineTo(w-o, h-o)
		dc.LineTo(o, h-o)
		dc.LineTo(o, o)
		dc.SetStrokeColor(c)
		dc.Stroke()
	}
	dc.Restore()
}
