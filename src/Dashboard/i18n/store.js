import create from "zustand";

/**
 * Fetch a language file from JSON or CSV. CSV should have "key" and "value" columns.
 * JSON file should be an object of key / value pairs.
 * @param {*} language
 * @param {*} url
 * @returns
 */
export const loadLanguage = async (language, url) => {
  if (typeof language !== "string")
    throw new Error("Language must be a string identifier");
  if (typeof url !== "string") throw new Error("URL must be a string");
  const isCsv = url.endsWith(".csv");
  return fetch(url)
    .then((response) => (isCsv ? response.text() : response.json()))
    .then((data) => {
      if (!isCsv) return data;
      return data.reduce((dict, row) => {
        const { key, value } = row;
        dict[key] = value;
        return dict;
      }, {});
    });
};

const useLangStore = create((set, get) => ({
  language: "en",
  setLanguage: (language, dict) => {
    if (typeof language !== "string")
      throw new Error("Language must be a string identifier");
    const result = {};
    result["language"] = language;
    if (typeof dict === "object")
      result["dict"] = { ...get().dict, [language]: dict };
    set(result);
  },
  dict: { en: {} },
  setLanguageDict: (dict) => set({ dict }),
  loadLanguageDict: async (language, url, activate = false) => {
    const langDictionary = await loadLanguage(language, url);
    const updates = {};
    updates["dict"] = { ...get().dict, [language]: langDictionary };
    if (activate) updates["language"] = language;
    if (!get().ready) updates["ready"] = true;
    set(updates);
    return langDictionary;
  },
  ready: false,
}));

export default useLangStore;
