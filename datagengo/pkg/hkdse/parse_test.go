package hkdse

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParseParagraphTextToSubNodes(t *testing.T) {
	{
		originalText := "先帝創業未半，而中道崩殂。"
		expectedResult := []ParagraphSubNode{
			{
				Type:    TextNodeType,
				Content: "先帝創業未半",
			},
			{
				Type:    PunctuationNodeType,
				Content: "，",
			},
			{
				Type:    TextNodeType,
				Content: "而中道崩殂",
			},
			{
				Type:    PunctuationNodeType,
				Content: "。",
			},
		}
		actualResult, err := ParseParagraphTextToSubNodes(originalText)
		assert.NoError(t, err)
		assert.Equal(t, expectedResult, actualResult)
	}
}
