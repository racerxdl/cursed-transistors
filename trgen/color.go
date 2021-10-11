package main

import (
	"github.com/lucasb-eyer/go-colorful"
	"image/color"
)

// adjust color cl "brightness" by using base brightness
// background color version
func adjustValue(base, cl color.Color) color.RGBA {
	bc, _ := colorful.MakeColor(base)
	bcl, _ := colorful.MakeColor(cl)

	_, _, v := bc.Hsv()
	h, s, _ := bcl.Hsv()
	r, g, b := colorful.Hsv(h, s, v).RGB255()
	return color.RGBA{
		R: r, G: g, B: b, A: 255,
	}
}

// adjust color cl "brightness" by using base brightness
// foreground color version
func adjustValueFg(base, cl color.Color) color.RGBA {
	bc, _ := colorful.MakeColor(base)
	bcl, _ := colorful.MakeColor(cl)

	_, _, v := bc.Hsv()
	h, s, _ := bcl.Hsv()
	v *= 1.1
	if v > 1 {
		v = 1
	}
	r, g, b := colorful.Hsv(h, s, v).RGB255()
	return color.RGBA{
		R: r, G: g, B: b, A: 255,
	}
}
