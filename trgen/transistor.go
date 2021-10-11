package main

type TrAttribute struct {
	Name     string
	Unit     string
	Value    float32
	Range    [2]float32
	Decimals int
}

var trNames = []string{
	"MOSFET",
	"BJT",
	"IGBT",
	"JFET",
}

var trVariants = [][]string{
	{"N", "P"},     // MOSFET
	{"PNP", "NPN"}, // BJT
	{"N", "P"},     // IGBT
	{"N", "P"},     // JFET
}

var trAttrs = [][4]TrAttribute{
	{
		{"Vmax", "V", 0, [2]float32{2, 1000}, 0},
		{"Imax", "A", 0, [2]float32{1, 200}, 0},
		{"t", "ns", 0, [2]float32{20, 1000}, 0},
		{"RDS(on)", "R", 0, [2]float32{0.0001, 4}, 8},
	}, // MOSFET
	{
		{"Vmax", "V", 0, [2]float32{2, 2400}, 0},
		{"Imax", "A", 0, [2]float32{1, 200}, 0},
		{"t", "ns", 0, [2]float32{100, 12000}, 0},
		{"Vce(on)", "V", 0, [2]float32{0.01, 4}, 3},
	}, // BJT
	{
		{"Vmax", "V", 0, [2]float32{2, 2400}, 0},
		{"Imax", "A", 0, [2]float32{1, 400}, 0},
		{"t", "ns", 0, [2]float32{400, 8000}, 0},
		{"Vce(on)", "V", 0, [2]float32{0.1, 10}, 3},
	}, // IGBT
	{
		{"Vmax", "V", 0, [2]float32{1, 100}, 0},
		{"Imax", "A", 0, [2]float32{1, 20}, 0},
		{"t", "ns", 0, [2]float32{1, 100}, 0},
		{"RDS(on)", "R", 0, [2]float32{0.000001, 2}, 8},
	}, // JFET
}
