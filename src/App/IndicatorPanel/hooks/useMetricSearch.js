import * as JsSearch from "js-search";
import { useMemo, useState } from "react";
import { useMetricConfig } from "@hyperobjekt/react-dashboard";

/**
 * Sets up a search index of all of the available metrics.
 * Returns handler functions for searching, and matching results, highlight string, and match counts.
 */
export default function useMetricSearch() {
  const metrics = useMetricConfig();
  const [highlight, setHighlight] = useState("");
  const [filter, setFilter] = useState([]);
  return useMemo(() => {
    // setup search
    const search = new JsSearch.Search("id");
    search.addIndex("name");
    search.addIndex("hint");
    search.addIndex("keywords");
    search.addDocuments(metrics);

    // number of matches for the current search text
    const matchCount = highlight ? filter.length : -1;

    // sets the substring to highlight, and the filter array to any matches
    const handleFilterChange = (event) => {
      const newValue = event.target.value;
      const matches = search.search(newValue).map((m) => m.id);
      setHighlight(newValue);
      setFilter(matches);
    };

    // clears any filtered items and substring highlighting
    const handleFilterClear = () => {
      setFilter([]);
      setHighlight("");
    };

    return {
      highlight,
      filter,
      matchCount,
      handleFilterChange,
      handleFilterClear,
    };
  }, [metrics, filter, highlight, setHighlight, setFilter]);
}
