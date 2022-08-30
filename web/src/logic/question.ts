import { OriginalEssay, ParagraphSubNodeType } from "../types/essay";

export interface Question {
  nodes: QuestionNode[];
  choices: string[];
  correctChoiceIndex: number;
}

export interface QuestionNode {
  type: QuestionNodeType;
  content: string;
}

export enum QuestionNodeType {
  CONTENT = "CONTENT",
  PLACEHOLDER = "PLACEHOLDER",
}

function randInt(n: number): number {
  return Math.floor(Math.random() * n);
}

function pickRandomElement<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const stopChars = new Set(["！", "。"]);

export function generateQuestionFromOriginalEssaySeg(art: OriginalEssay): Question {
  const paragraphs = art.paragraphs.filter(
    (p) => p && p.subNodes && p.textSegments && p.subNodes.length > 0 && p.textSegments.length > 0
  );
  const para = pickRandomElement(paragraphs);
  const pickedIndex = randInt(para.subNodes.length);
  let startIndex = pickedIndex;
  let endIndex = pickedIndex;
  while (!(startIndex === 0 || stopChars.has(para.subNodes[startIndex - 1].content))) {
    startIndex--;
  }
  while (
    !(endIndex === para.subNodes.length - 1 || stopChars.has(para.subNodes[endIndex].content))
  ) {
    endIndex++;
  }
  const selectedSegments = para.subNodes.slice(startIndex, endIndex + 1);
  let placeholderSegmentIndex: number = 0;
  while (true) {
    placeholderSegmentIndex = randInt(selectedSegments.length);
    if (selectedSegments[placeholderSegmentIndex].type === ParagraphSubNodeType.Text) {
      break;
    }
  }
  const beforeText = selectedSegments
    .slice(0, placeholderSegmentIndex)
    .map((s) => s.content)
    .join("");
  const afterText = selectedSegments
    .slice(placeholderSegmentIndex + 1)
    .map((s) => s.content)
    .join("");
  const replacedSegment = selectedSegments[placeholderSegmentIndex];
  const choices = [replacedSegment.content];
  for (let i = 0; i < 4; i++) {
    let choice = pickRandomElement(art.allTextSegments);
    while (choices.includes(choice)) {
      choice = pickRandomElement(art.allTextSegments);
    }
    choices.push(choice);
  }
  shuffleArray(choices);
  const correctIndex = choices.findIndex((c) => c === replacedSegment.content);
  return {
    choices,
    correctChoiceIndex: correctIndex,
    nodes: [
      {
        type: QuestionNodeType.CONTENT,
        content: beforeText,
      },
      {
        type: QuestionNodeType.PLACEHOLDER,
        content: replacedSegment.content,
      },
      {
        type: QuestionNodeType.CONTENT,
        content: afterText,
      },
    ],
  };
}

export function generateQuestionFromOriginalEssay(art: OriginalEssay): Question {
  const paragraphs = art.paragraphs.filter(
    (p) => p && p.subNodes && p.textSegments && p.subNodes.length > 0 && p.textSegments.length > 0
  );
  const para = pickRandomElement(paragraphs);
  const pickedIndex = randInt(para.textSegments.length);
  const selectedSeg = para.textSegments[pickedIndex]
  const pickedWordIndex =  randInt(selectedSeg.length);
  const selectedWord = selectedSeg[pickedWordIndex]
  const beforeText = selectedSeg
    .slice(0, pickedWordIndex);
  const afterText = selectedSeg
    .slice(pickedWordIndex + 1);
  const replacedSegment = selectedWord;
  const choices = [replacedSegment];
  for (let i = 0; i < 4; i++) {
    const choosenSegment = pickRandomElement(art.allTextSegments);
    const choiceIdx = randInt(choosenSegment.length);
    let choice = choosenSegment[choiceIdx];
    while (choices.includes(choice)) {
      const choosenSegment = pickRandomElement(art.allTextSegments);
      const choiceIdx = randInt(choosenSegment.length);
      choice = choosenSegment[choiceIdx];
    }
    choices.push(choice);
  }
  shuffleArray(choices);
  const correctIndex = choices.findIndex((c) => c === replacedSegment);
  return {
    choices,
    correctChoiceIndex: correctIndex,
    nodes: [
      {
        type: QuestionNodeType.CONTENT,
        content: beforeText,
      },
      {
        type: QuestionNodeType.PLACEHOLDER,
        content: replacedSegment,
      },
      {
        type: QuestionNodeType.CONTENT,
        content: afterText,
      },
    ],
  };
}
