package update

import (
	"context"
	"encoding/json"
	firebase "firebase.google.com/go/v4"
	"github.com/michaellee8/hkdse-chinese-practice/datagengo/pkg/hkdse"
	"github.com/pkg/errors"
	"os"
	"path/filepath"
)

func UploadFromDataDir(ctx context.Context, dirpath string, app *firebase.App) (err error) {
	const errMsg = "cannot upload data"

	client, err := app.Firestore(ctx)
	if err != nil {
		return errors.Wrap(err, errMsg)
	}

	essayCollection := client.Collection("chinese12Essays")

	subDirs, err := os.ReadDir(filepath.Join(dirpath, "input"))
	if err != nil {
		return errors.Wrap(err, errMsg)
	}

	var essayNames []string
	for _, sd := range subDirs {
		if sd.IsDir() {
			essayNames = append(essayNames, sd.Name())
		}
	}

	for _, essayName := range essayNames {
		originalJson, err := os.ReadFile(filepath.Join(dirpath, "output", essayName, "original.json"))
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		orginalEssay := &hkdse.OriginalEssay{}
		err = json.Unmarshal(originalJson, orginalEssay)
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		entry := ChineseTwelveEssayEntry{
			Name:       essayName,
			Original:   orginalEssay,
			Translated: nil,
		}

		existingEntriesIter := essayCollection.Where("name", "==", entry.Name).Documents(ctx)
		existingEntries, err := existingEntriesIter.GetAll()
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		if len(existingEntries) == 0 {
			_, _, err = essayCollection.Add(ctx, entry)
			if err != nil {
				return errors.Wrap(err, errMsg)
			}
		} else {
			for idx, snapshot := range existingEntries {
				if idx != 0 {
					// Only keep the first entry
					_, err = snapshot.Ref.Delete(ctx)
					if err != nil {
						return errors.Wrap(err, errMsg)
					}
				} else {
					_, err = snapshot.Ref.Set(ctx, entry)
					if err != nil {
						return errors.Wrap(err, errMsg)
					}
				}
			}
		}

	}
	return nil
}

type ChineseTwelveEssayEntry struct {
	Name       string                 `json:"name"`
	Original   *hkdse.OriginalEssay   `json:"original"`
	Translated *hkdse.TranslatedEssay `json:"translated"`
}
