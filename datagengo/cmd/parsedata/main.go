package main

import (
	"github.com/michaellee8/hkdse-chinese-practice/datagengo/pkg/hkdse"
	"log"
	"os"
	"path/filepath"
)

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Panicf("%+v", err)
	}
	err = hkdse.GenerateFromDataDir(filepath.Join(cwd, "data"))
	if err != nil {
		log.Panicf("%+v", err)
	}
}
