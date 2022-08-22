import { useCollectionData } from "react-firebase-hooks/firestore";
import { useContext, useState } from "react";
import { ESSAY_COLLECTION, FirebaseContext } from "../config/firebase";
import { getFirestore, collection } from "firebase/firestore";
import { ChineseTwelveEssayEntry } from "../types/essay";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export function OriginalTextRecitePage() {
  const firebaseApp = useContext(FirebaseContext);
  const db = getFirestore(firebaseApp);
  const [values, loading, error, snapshot] = useCollectionData<ChineseTwelveEssayEntry>(
    collection(db, ESSAY_COLLECTION) as any
  );
  const { t } = useTranslation();
  const [selectedArticleName, setSelectedArticleName] = useState("");
  const selectedArticle = values?.find((e) => e.name === selectedArticleName);
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
      </Stack>
    </Box>
  );
}
