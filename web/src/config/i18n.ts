import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Locize from "i18next-locize-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Locize)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "zh-Hant-HK",
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: true,
    },
    saveMissing: true,
    backend: {
      projectId: "8d48a7dc-4260-41d4-9fe4-1edc5b987057",
      apiKey: process.env.REACT_APP_LOCIZE_API_KEY,
      referenceLng: "en",
    },
  });

export { i18n };
