export interface ChineseTwelveEssayEntry {
  name: string
  original: OriginalEssay | null
  Translated: TranslatedEssay | null
}

export interface TranslatedEssay {}

export interface OriginalEssay {
  name: string
  paragraphs: Paragraph[]
  allTextSegments: string[]
}

export interface Paragraph {
  textSegments: string[]
  subNodes: ParagraphSubNode[]
}

export interface ParagraphSubNode {
  type: ParagraphSubNodeType
  content: string
}

export enum ParagraphSubNodeType {
  Text = "TEXT",
  Punctuation = "PUNCTUATION"
}