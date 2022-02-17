import { useEffect } from "react";
import { useLangStore } from ".";

/**
 * Loads a remote language dictionary into the store from the provided URL.
 * @param {*} lang
 * @param {*} url
 */
export default function useLoadLang(lang, url) {
  const loadLanguageDict = useLangStore((state) => state.loadLanguageDict);
  useEffect(() => {
    lang && url && loadLanguageDict(lang, url);
  }, [lang, url, loadLanguageDict]);
}
