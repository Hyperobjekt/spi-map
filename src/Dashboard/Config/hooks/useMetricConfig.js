import { useMemo } from "react";
import { useConfigStore } from "..";
import { useLangObject } from "../../i18n";

/**
 * Returns all metrics config, or an individual metric config if ID is provided
 * @param {string} id (optional) metric ID
 * @returns {Array|object} array of metric configs or single metric config
 */
export default function useMetricConfig(id) {
  const metrics = useConfigStore((state) => state.metrics);
  const metricIds = metrics.map((m) => m.id);
  const metricNames = useLangObject(metricIds, { prefix: "METRIC_" });
  const metricHints = useLangObject(metricIds, { prefix: "HINT_" });
  const metricUnits = useLangObject(metricIds, { prefix: "UNIT_" });
  return useMemo(() => {
    const metricsWithLang = metrics.map((m) => {
      return {
        ...m,
        name: metricNames[m.id],
        hint: metricHints[m.id],
        unit: metricUnits[m.id],
      };
    });
    if (!id) return metricsWithLang;
    return metricsWithLang.find((r) => r.id === id);
  }, [id, metrics, metricNames, metricHints, metricUnits]);
}
