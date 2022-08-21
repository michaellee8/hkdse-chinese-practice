package main

import (
	"context"
	firebase "firebase.google.com/go/v4"
	"github.com/michaellee8/hkdse-chinese-practice/datagengo/pkg/update"
	"log"
	"os"
	"path/filepath"
)

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Panicf("%+v", err)
	}
	ctx := context.TODO()
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		log.Panicf("%+v", err)
	}
	err = update.UploadFromDataDir(ctx, filepath.Join(cwd, "data"), app)
	if err != nil {
		log.Panicf("%+v", err)
	}
}
