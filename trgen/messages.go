package main

import "strings"

func removeEmptyElements(data []string) []string {
	newData := make([]string, 0, len(data))
	for _, v := range data {
		if strings.Trim(v, "\r\n ") != "" {
			newData = append(newData, v)
		}
	}

	return newData
}
