import { useEffect } from "react";
import { useLangStore } from ".";

export default function useSetLang(lang, langDict) {
  const setLanguage = useLangStore((state) => state.setLanguage);
  useEffect(() => {
    lang && typeof langDict === "object" && setLanguage(lang, langDict);
  }, [lang, langDict, setLanguage]);
}
