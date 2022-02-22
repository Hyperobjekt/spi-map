import { useLang } from ".";

/**
 * Return lang entries for a single id or array of ids
 * @param {Array<string>} ids
 * @param {object} options
 * @param {string} options.prefix - prefix to prepend to each of the ids
 * @param {object} options.context - context to use to when interpolating the string
 * @returns
 */
export default function useLangObject(ids, { prefix = "", context } = {}) {
  // wrap single id in array
  if (typeof ids === "string") ids = [ids];
  // map metric ids to lang key
  const langKeys = ids.map((id) => {
    return `${(prefix || "") + id}`.toUpperCase();
  });
  // pull lang entries for keys from store
  const langEntries = useLang(langKeys, context);
  // if single entry, return single entry
  const langArray =
    typeof langEntries === "string" ? [langEntries] : langEntries;
  // return object mapping metric ID to lang entry
  return langArray.reduce((lang, entry, idx) => {
    lang[ids[idx]] = entry;
    return lang;
  }, {});
}
