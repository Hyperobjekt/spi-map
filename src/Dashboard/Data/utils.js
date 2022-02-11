import { parseCsvString, parseJsonData } from "../Parsers";

/**
 * Fetches a CSV or JSON file, parses it, and returns the data.
 */
export const fetchDataSource = async (url, parser) => {
  const isCsv = url.endsWith(".csv");
  return fetch(url)
    .then((response) => {
      return isCsv ? response.text() : response.json();
    })
    .then((data) => {
      return isCsv ? parseCsvString(data, parser) : parseJsonData(data, parser);
    });
};
