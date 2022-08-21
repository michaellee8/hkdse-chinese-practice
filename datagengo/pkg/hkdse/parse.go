package hkdse

import (
	"encoding/json"
	"github.com/pkg/errors"
	"os"
	"path/filepath"
	"strings"
)

func GenerateFromDataDir(dirpath string) (err error) {
	const errMsg = "cannot generate from data directory"

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

	if err := os.MkdirAll(filepath.Join(dirpath, "output"), os.ModePerm); err != nil {
		return errors.Wrap(err, errMsg)
	}

	for _, essayName := range essayNames {
		essayText, err := os.ReadFile(filepath.Join(dirpath, "input", essayName, "original.txt"))
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		essay, err := ParseOriginalEssayText(string(essayText), essayName)
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		if err := os.MkdirAll(filepath.Join(dirpath, "output", essayName), os.ModePerm); err != nil {
			return errors.Wrap(err, errMsg)
		}
		rawOutput, err := json.Marshal(essay)
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
		err = os.WriteFile(filepath.Join(dirpath, "output", essayName, "original.json"), rawOutput, os.ModePerm)
		if err != nil {
			return errors.Wrap(err, errMsg)
		}
	}

	return nil
}

func ParseOriginalEssayText(text string, essayName string) (essay *OriginalEssay, err error) {
	const errMsg = "cannot parse original essay text"

	var allTextSegments []string
	var paragraphs []Paragraph

	paragraphTexts := strings.Split(text, "\n")

	for i := range paragraphTexts {
		paragraphTexts[i] = strings.TrimSpace(paragraphTexts[i])
	}

	for _, pText := range paragraphTexts {
		subNodes, err := ParseParagraphTextToSubNodes(pText)
		if err != nil {
			return nil, errors.Wrap(err, errMsg)
		}
		var textSegments []string
		for _, sn := range subNodes {
			if sn.Type == TextNodeType {
				textSegments = append(textSegments, sn.Content)
				allTextSegments = append(allTextSegments, sn.Content)
			}
		}
		paragraphs = append(paragraphs, Paragraph{
			TextSegments: textSegments,
			SubNodes:     subNodes,
		})
	}

	return &OriginalEssay{
		Name:            essayName,
		Paragraphs:      paragraphs,
		AllTextSegments: allTextSegments,
	}, nil
}

func ParseParagraphTextToSubNodes(text string) (subNodes []ParagraphSubNode, err error) {
	var curSeg string
	for _, c := range text {
		if IsPunctuation(c) {
			subNodes = append(subNodes, ParagraphSubNode{
				Type:    TextNodeType,
				Content: curSeg,
			})
			curSeg = ""
			subNodes = append(subNodes, ParagraphSubNode{
				Type:    PunctuationNodeType,
				Content: string(c),
			})
		} else {
			curSeg += string(c)
		}
	}
	if len(curSeg) > 0 {
		subNodes = append(subNodes, ParagraphSubNode{
			Type:    TextNodeType,
			Content: curSeg,
		})
	}
	return
}

type OriginalEssay struct {
	Name            string      `json:"name"`
	Paragraphs      []Paragraph `json:"paragraphs"`
	AllTextSegments []string    `json:"allTextSegments"`
}

type TranslatedEssay struct {
}

type Paragraph struct {
	TextSegments []string           `json:"textSegments"`
	SubNodes     []ParagraphSubNode `json:"subNodes"`
}

type ParagraphSubNode struct {
	Type    ParagraphSubNodeType `json:"type"`
	Content string               `json:"content"`
}

type ParagraphSubNodeType string

const (
	TextNodeType        ParagraphSubNodeType = "TEXT"
	PunctuationNodeType ParagraphSubNodeType = "PUNCTUATION"
)
