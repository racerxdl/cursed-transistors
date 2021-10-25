package main

import (
	crand "crypto/rand"
	"encoding/binary"
	"golang.org/x/exp/rand"
	"math"
	"time"
)

// randFloatRange generates a float32 in the specified range by using exponential decay
func randFloatRange(min, max float32) float32 {
	delta := float64(max - min)
	mean := float64(0)

	for i := 0; i < 4; i++ {
		v := rand.ExpFloat64() * (delta / 3)
		if v > delta {
			v = delta
		}
		mean += v
	}
	v := mean / 4
	return float32(v) + min
}

// roundCases rounds the specified float32 to number of decimal cases
func roundCases(v float32, n int) float32 {
	if n != 0 {
		v *= float32(10 * n)
	}
	v = float32(math.Round(float64(v)))
	if n != 0 {
		v /= float32(10 * n)
	}
	return v
}

// randInt returns an int in the range [0, max]
func randInt(max int) int {
	return rand.Intn(max)
}

func reseed() {
	baseSeed := uint64(time.Now().UnixNano())
	baseSeed ^= rand.Uint64()

	s := make([]byte, 8)
	for i := 0; i < 16; i++ {
		_, err := crand.Read(s)
		if err != nil {
			i--
		} else {
			baseSeed ^= binary.LittleEndian.Uint64(s)
		}
	}

	rand.Seed(baseSeed)
}

func shuffleStringSlice(data []string) {
	rand.Shuffle(len(data), func(i, j int) {
		data[i], data[j] = data[j], data[i]
	})
}

func init() {
	reseed()
}
