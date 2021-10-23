package main

import (
	"encoding/json"
	"github.com/alecthomas/kong"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/prom2json"
	"io/ioutil"
	"os"
	"path"
	"strings"
)

// Prometheus because I'm lazy

var registry = prometheus.NewRegistry()

type TrAttribute struct {
	Name     string
	Unit     string
	Value    float32
	Range    [2]float32
	Decimals int
}

type TrAttrCollection [4]TrAttribute

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

func (n OpenSeaNFT) GetTransistor() string {
	for _, v := range n.Attributes {
		if s, ok := v.(map[string]interface{}); ok {
			if strings.EqualFold(s["trait_type"].(string), "Transistor") {
				return s["value"].(string)
			}
		}
	}
	panic("NO TRANSISTOR TYPE")
}

var CLI struct {
	Folder string `arg:"" name:"path" help:"Folder with json files to migrate"`
}

var (
	TotalTransistors = prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "total_transistors",
		Help: "The total number of transistors",
	}, []string{"type"})
	Attributes = map[string]*prometheus.HistogramVec{
		"vmax": prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "vmax_histogram",
			Help:    "Max Voltage Histogram",
			Buckets: prometheus.LinearBuckets(1, 50, 48),
		}, []string{"type"}),
		"imax": prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "imax_histogram",
			Help:    "Max Current Histogram",
			Buckets: prometheus.LinearBuckets(1, 10, 40),
		}, []string{"type"}),
		"t": prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "t_histogram",
			Help:    "Transition Time Histogram",
			Buckets: prometheus.LinearBuckets(1, 300, 40),
		}, []string{"type"}),
		"vce(on)": prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "vceon_histogram",
			Help:    "Collector-Emitter (on) Voltage Histogram",
			Buckets: prometheus.LinearBuckets(1, 0.25, 40),
		}, []string{"type"}),
		"rds(on)": prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "rdson_histogram",
			Help:    "Drain-Source resistance (on) Histogram",
			Buckets: prometheus.LinearBuckets(1, 0.1, 40),
		}, []string{"type"}),
	}
)

func init() {
	registry.MustRegister(TotalTransistors)
	for _, v := range Attributes {
		registry.MustRegister(v)
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
			m := OpenSeaNFT{}
			data, err := ioutil.ReadFile(filepath)
			if err != nil {
				panic(err)
			}
			err = json.Unmarshal(data, &m)
			if err != nil {
				panic(err)
			}
			TotalTransistors.WithLabelValues(m.Name).Inc()
			for _, v := range m.CTAttributes {
				t := strings.ToLower(v.Name)
				Attributes[t].WithLabelValues(m.GetTransistor()).Observe(float64(v.Value))
			}
		}
	}

	var dmetrics []*prom2json.Family

	metrics, _ := registry.Gather()
	for _, v := range metrics {
		f := prom2json.NewFamily(v)
		dmetrics = append(dmetrics, f)
	}

	v, _ := json.MarshalIndent(dmetrics, "", "   ")
	_ = ioutil.WriteFile("metrics.json", v, os.ModePerm)
}
