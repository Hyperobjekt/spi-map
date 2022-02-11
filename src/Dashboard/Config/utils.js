import { getDefaultParser } from ".";
import { parseCsvString, parseJsonData } from "../Parsers";

/**
 * Returns how many values have a non-wildcard match in the provided array.
 * @param {Array<string>} values
 * @returns {number} number of values that match
 */
const getExplicitMatchCount = (values) => {
  return values.reduce((acc, value) => {
    if (value && value !== "*") acc = acc + 1;
    return acc;
  }, 0);
};

/** Returns the keys in common from obj1 and obj2 */
const getMutualKeys = (obj1, obj2) => {
  const keys = Object.keys(obj1).filter((key) => obj2[key]);
  return keys.length > 0 ? keys : null;
};

/**
 * Loads configuration from a remote file.
 * @param {*} url
 * @param {*} options {type: string, format: "json"|"csv", parser: function }
 */
export async function loadConfig(url, options = {}) {
  // type of configuration to load
  const configType = options.type;
  // use the provided parser or fallback to a default if one exists
  const parser = options.parser || getDefaultParser(configType);
  const format = options.format;
  const isCsv = format === "csv" || url.endsWith(".csv");
  const isJson = format === "json" || url.endsWith(".json");
  if (!isCsv && !isJson)
    throw new Error("Invalid format provided, must be csv or json");
  return fetch(url)
    .then((response) => {
      return isCsv ? response.text() : response.json();
    })
    .then((data) => {
      const configValue = isCsv ? parseCsvString(data, parser) : data;
      return configValue;
    });
}

/**
 * Checks if the provided configuration value is a match for the provided value.
 * @param {string|Array<string>} configValue
 * @param {string} actualValue
 * @returns {boolean} true if the value matches the config value
 */
export const isMatch = (configValue, actualValue) => {
  // config value should be a string or array of strings
  if (typeof configValue !== "string" && !Array.isArray(configValue))
    return false;
  if (configValue === "*") return true; // wildcard match
  if (configValue === actualValue) return true; // values equal
  if (Array.isArray(configValue)) return configValue.includes(actualValue);
  return false;
};

/**
 * Returns the entry that is the most specific match for the provided context.
 * @param {object} context - The context to match against.
 * @param {Array<object>} entries - The config entries to match against.
 * @param {Array<string>} keys - The keys to match against (optional).
 * @returns {object} A matching entry with the fewest wildcard matches.
 */
export const getBestMatch = (context = {}, entries = [], keys) => {
  if (entries.length === 0) return null; // return if no entries or no match keys
  keys = keys || getMutualKeys(context, entries[0]); // use provided keys or fallback to mutual keys in context and first entry
  if (!keys || keys.length === 0) return null; // return if no entries or no match keys
  const matchingEntries = getAllMatches(context, entries, keys);
  if (matchingEntries.length === 0) return null; // return if no matches
  if (matchingEntries.length === 1) return matchingEntries[0]; // return if single match
  let matchCount = -1;
  let bestMatch = null;
  for (let i = 0; i < matchingEntries.length; i++) {
    const entry = matchingEntries[i];
    const entryValues = keys.map((key) => entry[key]);
    const entryMatchCount = getExplicitMatchCount(entryValues);
    if (entryMatchCount < matchCount) continue; // skip if this entry has less matches than the current best match
    matchCount = entryMatchCount;
    bestMatch = entry;
  }
  return bestMatch;
};

/**
 * Returns a subset of entries that match the provided context.
 * @param {object} context - The context to match against.
 * @param {Array<object>} entries - The config entries to match against.
 * @param {Array<string>} keys - The keys to match against (optional).
 * @returns {Array<object>} All matching config entries
 */
export const getAllMatches = (context = {}, entries = [], keys) => {
  keys = keys || Object.keys(context); // use provided keys or fallback to keys in the context
  if (entries.length === 0 || keys.length === 0) return null; // return if no entries or no match keys
  // returns entries where all keys match the context
  const matches = entries.filter((entry) => {
    // true if all keys match config entry
    return keys.reduce((matched, key) => {
      if (!matched) return false;
      return isMatch(entry[key], context[key]);
    }, true);
  });
  return matches;
};
