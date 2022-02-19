import { useMemo } from "react";
import { useMetricConfig } from "../Config";
import { getFormatter } from "../Formatters";

/**
 * Returns the formatter function for a given metric,
 * or defaults to auto number format if no format configuration
 * exists for the metric.
 * @param {*} id metric id
 * @param {*} type "full" or "short"
 * @returns {function} a function that formats values
 */
export default function useMetricFormatter(id, type = "full") {
  const metric = useMetricConfig(id);
  if (type !== "full" && type !== "short") {
    console.warn(
      `invalid format type provided to useMetricFormatter: ${type}, using default formatter`
    );
    type = "full";
  }
  return useMemo(() => {
    const key = type === "full" ? "format" : "short_format";
    const formatType = metric?.[key] || "number";
    return getFormatter(formatType);
  }, [metric, type]);
}
