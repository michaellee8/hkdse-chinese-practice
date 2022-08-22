import { useCollectionData } from "react-firebase-hooks/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { ESSAY_COLLECTION, FirebaseContext } from "../config/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { ChineseTwelveEssayEntry } from "../types/essay";
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { generateQuestionFromOriginalEssay, Question, QuestionNodeType } from "../logic/question";
import { Check as CheckIcon, Clear as ClearIcon } from "@mui/icons-material";
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
  const selectedArticle = values?.find((e) => e.name === selectedArticleName);
  const makeNewQuestion = useCallback(() => {
    if (!selectedArticle || !selectedArticle.original) {
      setQuestion(null);
      return;
    }
    setQuestion(generateQuestionFromOriginalEssay(selectedArticle.original));
  }, [selectedArticle]);
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [disableChoices, setDisableChoices] = useState(false);

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
        <Typography variant={"subtitle1"}>
          {`${t("score")}: ${correctCount}/${questionNum}`}
        </Typography>
        {question ? (
          <Box>
            {question.nodes.map((qn, idx) =>
              qn.type === QuestionNodeType.PLACEHOLDER ? (
                <Box key={idx}>
                  <FormControl>
                    <RadioGroup
                      name={"question-choice-picker-group"}
                      value={pickedAnswerIndex}
                      onChange={(evt) => setPickedAnswerIndex(parseInt(evt.target.value))}
                    >
                      {question?.choices.map((ch, i) => (
                        <FormControlLabel
                          control={<Radio disabled={disableChoices} />}
                          label={
                            <div>
                              {ch}
                              {showSolution ? (
                                i === question?.correctChoiceIndex ? (
                                  <CheckIcon />
                                ) : (
                                  <ClearIcon />
                                )
                              ) : null}
                            </div>
                          }
                          value={i}
                        />
                      ))}
                    </RadioGroup>
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
