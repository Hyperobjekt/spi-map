import { useMemo } from "react";
import { useConfigStore } from "..";
import { getFormatter } from "../../Formatters";
import { useLangObject } from "../../i18n";

/**
 * Returns all metrics config, or an individual metric config if ID is provided
 * @param {string|Array<string>} id (optional) metric ID, or array of IDs.  returns all metrics if undefined.
 * @returns {Array|object} array of metric configs or single metric config
 */
export default function useMetricConfig(id) {
  const metrics = useConfigStore((state) => state.metrics);
  const idArray =
    typeof id === "string"
      ? [id]
      : Array.isArray(id)
      ? id
      : metrics.map((m) => m.id);
  // pull language and formatters for the metrics
  const metricNames = useLangObject(idArray, { prefix: "METRIC_" });
  const metricHints = useLangObject(idArray, { prefix: "HINT_" });
  const metricUnits = useLangObject(idArray, { prefix: "UNIT_" });
  return useMemo(() => {
    // use id argument for metrics to fetch if it is specified, otherwise use all
    const sourceMetrics =
      idArray.length !== metrics.length
        ? metrics.filter((m) => idArray.indexOf(m.id) > -1)
        : metrics;
    // pull formatters for the metrics
    const metricFormatters = sourceMetrics.reduce((formattersById, m) => {
      formattersById[m.id] = {
        formatter: getFormatter(m.format),
        shortFormatter: getFormatter(m.short_format || m.format),
      };
      return formattersById;
    }, {});
    // create a new array of metric configs with the language and formatters
    const metricsWithLang = sourceMetrics.map((m) => {
      return {
        ...m,
        name: metricNames[m.id],
        hint: metricHints[m.id],
        unit: metricUnits[m.id],
        ...metricFormatters[m.id],
      };
    });
    // return single metric if only one ID is specified
    if (typeof id === "string") return metricsWithLang.find((m) => m.id === id);
    // return array of metrics if multiple IDs (or no IDs) are specified
    return metricsWithLang;
    // the values will only change when id / metrics change, so ignore linting error here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, metrics]);
}
