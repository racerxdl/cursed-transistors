package main

import (
	"golang.org/x/image/colornames"
	"image/color"
)

var goldBorderPalette = []color.RGBA{
	{R: 205, G: 157, B: 64, A: 255},
	{R: 228, G: 192, B: 104, A: 255},
	{R: 250, G: 225, B: 138, A: 255},
	{R: 239, G: 210, B: 123, A: 255},
	{R: 208, G: 167, B: 81, A: 255},
	{R: 179, G: 127, B: 41, A: 255},
	{R: 155, G: 93, B: 4, A: 255},
	{R: 201, G: 137, B: 50, A: 255},
}

var silverBorderPalette = []color.RGBA{
	{R: 166, G: 166, B: 166, A: 255},
	{R: 197, G: 197, B: 197, A: 255},
	{R: 227, G: 227, B: 227, A: 255},
	{R: 213, G: 213, B: 213, A: 255},
	{R: 174, G: 174, B: 174, A: 255},
	{R: 138, G: 138, B: 138, A: 255},
	{R: 109, G: 109, B: 109, A: 255},
	{R: 163, G: 163, B: 163, A: 255},
}

// Background replacement colors
var picBgLevels = []color.RGBA{
	{R: 30, G: 30, B: 30, A: 255},
	{R: 64, G: 64, B: 64, A: 255},
	{R: 127, G: 127, B: 127, A: 255},
	{R: 204, G: 204, B: 204, A: 255},
}

// Transistor replacement colors
var picTrLevels = []color.RGBA{
	{171, 171, 171, 255},
	{255, 255, 255, 255},
}

// All possible base colors
var bgColors = []color.RGBA{
	colornames.Aliceblue,
	colornames.Antiquewhite,
	colornames.Aqua,
	colornames.Aquamarine,
	colornames.Azure,
	colornames.Beige,
	colornames.Bisque,
	colornames.Black,
	colornames.Blanchedalmond,
	colornames.Blue,
	colornames.Blueviolet,
	colornames.Brown,
	colornames.Burlywood,
	colornames.Cadetblue,
	colornames.Chartreuse,
	colornames.Chocolate,
	colornames.Coral,
	colornames.Cornflowerblue,
	colornames.Cornsilk,
	colornames.Crimson,
	colornames.Cyan,
	colornames.Darkblue,
	colornames.Darkcyan,
	colornames.Darkgoldenrod,
	colornames.Darkgray,
	colornames.Darkgreen,
	colornames.Darkgrey,
	colornames.Darkkhaki,
	colornames.Darkmagenta,
	colornames.Darkolivegreen,
	colornames.Darkorange,
	colornames.Darkorchid,
	colornames.Darkred,
	colornames.Darksalmon,
	colornames.Darkseagreen,
	colornames.Darkslateblue,
	colornames.Darkslategray,
	colornames.Darkslategrey,
	colornames.Darkturquoise,
	colornames.Darkviolet,
	colornames.Deeppink,
	colornames.Deepskyblue,
	colornames.Dimgray,
	colornames.Dimgrey,
	colornames.Dodgerblue,
	colornames.Firebrick,
	colornames.Floralwhite,
	colornames.Forestgreen,
	colornames.Fuchsia,
	colornames.Gainsboro,
	colornames.Ghostwhite,
	colornames.Gold,
	colornames.Goldenrod,
	colornames.Gray,
	colornames.Green,
	colornames.Greenyellow,
	colornames.Grey,
	colornames.Honeydew,
	colornames.Hotpink,
	colornames.Indianred,
	colornames.Indigo,
	colornames.Ivory,
	colornames.Khaki,
	colornames.Lavender,
	colornames.Lavenderblush,
	colornames.Lawngreen,
	colornames.Lemonchiffon,
	colornames.Lightblue,
	colornames.Lightcoral,
	colornames.Lightcyan,
	colornames.Lightgoldenrodyellow,
	colornames.Lightgray,
	colornames.Lightgreen,
	colornames.Lightgrey,
	colornames.Lightpink,
	colornames.Lightsalmon,
	colornames.Lightseagreen,
	colornames.Lightskyblue,
	colornames.Lightslategray,
	colornames.Lightslategrey,
	colornames.Lightsteelblue,
	colornames.Lightyellow,
	colornames.Lime,
	colornames.Limegreen,
	colornames.Linen,
	colornames.Magenta,
	colornames.Maroon,
	colornames.Mediumaquamarine,
	colornames.Mediumblue,
	colornames.Mediumorchid,
	colornames.Mediumpurple,
	colornames.Mediumseagreen,
	colornames.Mediumslateblue,
	colornames.Mediumspringgreen,
	colornames.Mediumturquoise,
	colornames.Mediumvioletred,
	colornames.Midnightblue,
	colornames.Mintcream,
	colornames.Mistyrose,
	colornames.Moccasin,
	colornames.Navajowhite,
	colornames.Navy,
	colornames.Oldlace,
	colornames.Olive,
	colornames.Olivedrab,
	colornames.Orange,
	colornames.Orangered,
	colornames.Orchid,
	colornames.Palegoldenrod,
	colornames.Palegreen,
	colornames.Paleturquoise,
	colornames.Palevioletred,
	colornames.Papayawhip,
	colornames.Peachpuff,
	colornames.Peru,
	colornames.Pink,
	colornames.Plum,
	colornames.Powderblue,
	colornames.Purple,
	colornames.Red,
	colornames.Rosybrown,
	colornames.Royalblue,
	colornames.Saddlebrown,
	colornames.Salmon,
	colornames.Sandybrown,
	colornames.Seagreen,
	colornames.Seashell,
	colornames.Sienna,
	colornames.Silver,
	colornames.Skyblue,
	colornames.Slateblue,
	colornames.Slategray,
	colornames.Slategrey,
	colornames.Snow,
	colornames.Springgreen,
	colornames.Steelblue,
	colornames.Tan,
	colornames.Teal,
	colornames.Thistle,
	colornames.Tomato,
	colornames.Turquoise,
	colornames.Violet,
	colornames.Wheat,
	colornames.White,
	colornames.Whitesmoke,
	colornames.Yellow,
	colornames.Yellowgreen,
}
