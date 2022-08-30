import { useCollectionData } from "react-firebase-hooks/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { ESSAY_COLLECTION, FirebaseContext } from "../config/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { ChineseTwelveEssayEntry } from "../types/essay";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { generateQuestionFromOriginalEssaySeg, generateQuestionFromOriginalEssay, Question, QuestionNodeType } from "../logic/question";
import { delay } from "../utils";

const showAnswerDelay = 1500;

export function OriginalTextRecitePage() {
  const firebaseApp = useContext(FirebaseContext);
  const db = getFirestore(firebaseApp);
  const [values, loading, error] = useCollectionData<ChineseTwelveEssayEntry>(
    collection(db, ESSAY_COLLECTION) as any
  );
  const [question, setQuestion] = useState<Question | null>(null);
  const { t } = useTranslation();
  const [selectedArticleName, setSelectedArticleName] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const selectedArticle = values?.find((e) => e.name === selectedArticleName);
  const questionType = selectedQuestionType
  const makeNewQuestion = useCallback(() => {
    if (!selectedArticle || !selectedArticle.original) {
      setQuestion(null);
      return;
    }
    if (questionType === 'Sentence') {
      setQuestion(generateQuestionFromOriginalEssaySeg(selectedArticle.original));
    }
    else if(questionType === 'Word') {
      setQuestion(generateQuestionFromOriginalEssay(selectedArticle.original));
    }
  }, [selectedArticle, questionType]);
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [, setShowSolution] = useState(false);
  const [, setDisableChoices] = useState(false);

  useCallback(() => {
    setQuestionNum((p) => p + 1);
  }, []);
  const [pickedAnswerIndex, setPickedAnswerIndex] = useState<number | null>(null);
  const checkAnswer = useCallback(async () => {
    if (pickedAnswerIndex === null) {
      return;
    }
    setShowSolution(true);
    setDisableChoices(true);
    if (pickedAnswerIndex === question?.correctChoiceIndex) {
      setCorrectCount((c) => c + 1);
    }
    await delay(showAnswerDelay);
    setShowSolution(false);
    setDisableChoices(false);
    setPickedAnswerIndex(null);
    setQuestionNum((c) => c + 1);
  }, [pickedAnswerIndex, question?.correctChoiceIndex]);
  useEffect(() => {
    checkAnswer().catch(console.error);
  }, [pickedAnswerIndex, checkAnswer]);
  useEffect(() => {
    makeNewQuestion();
  }, [makeNewQuestion, questionNum, selectedArticleName]);
  if (error) {
    console.error(error);
  }
  if (loading || error) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel id={"article-name-select-label"}>{t("Please choose an article.")}</InputLabel>
          <Select
            labelId={"article-name-select-label"}
            id={"article-name-select"}
            value={selectedArticleName}
            label={t("Please choose an article.")}
            onChange={(evt) => {
              setSelectedArticleName(evt.target.value as string);
            }}
          >
            {values?.map((e) => (
              <MenuItem value={e.name}>{e.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id={"question-select-label"}>{t("Please choose the question type.")}</InputLabel>
          <Select
            labelId={"question-select-label"}
            id={"question-type-select"}
            value={selectedQuestionType}
            label={t("Please choose a question type.")}
            onChange={(evt) => {
              setSelectedQuestionType(evt.target.value as string);
            }}
          >
            <MenuItem value={'Sentence'}>Sentence</MenuItem>
            <MenuItem value={'Word'}>Word</MenuItem>
          </Select>
        </FormControl>
        <Typography variant={"subtitle1"}>
          {`${t("score")}: ${correctCount}/${questionNum}`}
        </Typography>
        {question ? (
          <Box>
            {question.nodes.map((qn, idx) =>
              qn.type === QuestionNodeType.PLACEHOLDER ? (
                <Box key={idx}>
                  <FormControl fullWidth>
                    <InputLabel id="question-choice-picker-group">{t("Please choose an answer.")}</InputLabel>

                    <Select
                      labelId={"question-choice-picker-group"}
                      id={"question-choice-picker"}
                      value={pickedAnswerIndex}
                      label={t("Please choose an answer.")}
                      onChange={(evt) => setPickedAnswerIndex(evt.target.value === null ? null : parseInt(evt.target.value.toString()))}                
                    >
                      {question?.choices.map((ch, i) => (
                        <MenuItem value={ch}>{ch}</MenuItem>
                      ))}
                    </Select> 
                  </FormControl>
                </Box>
              ) : (
                <Typography paragraph key={idx}>
                  {qn.content}
                </Typography>
              )
            )}
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
