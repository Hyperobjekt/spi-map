import * as JsSearch from "js-search";
import { useMemo } from "react";
import { useMetricConfig } from "../../../Dashboard";

export default function useMetricSearch() {
  const metrics = useMetricConfig();
  return useMemo(() => {
    const search = new JsSearch.Search("id");
    search.addIndex("name");
    search.addIndex("hint");
    search.addIndex("keywords");
    search.addDocuments(metrics);
    return search;
  }, [metrics]);
}
