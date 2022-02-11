import { useMemo } from "react";
import { useConfigStore } from "..";
import { getAllMatches, getBestMatch } from "../utils";

/**
 * Returns all metrics config, or an individual metric config if ID is provided
 * @param {string} id (optional) metric ID
 * @returns {Array|object} array of metric configs or single metric config
 */
export default function useMetricConfig(id) {
  const metrics = useConfigStore((state) => state.metrics);
  return useMemo(() => {
    if (!id) return metrics;
    return metrics.find((r) => r.id === id);
  }, [id, metrics]);
}

/**
 * Returns config for a given metric ID along with scale, data source, and map layer config.
 * @param {*} id
 * @param {*} param1
 * @returns
 */
export function useFullMetricConfig(id, { region_id, subgroup_id, year }) {
  const metrics = useConfigStore((state) => state.metrics);
  const scales = useConfigStore((state) => state.scales);
  const dataSources = useConfigStore((state) => state.dataSources);
  const mapLayers = useConfigStore((state) => state.mapLayers);
  return useMemo(() => {
    if (!metrics || !scales) return null;
    const metric = metrics.find((m) => m.id === id);
    if (!metric) return null;
    const matchContext = { metric_id: id, region_id, subgroup_id, year };
    return {
      ...metric,
      scale: getBestMatch(matchContext, scales),
      dataSource: getBestMatch(matchContext, dataSources),
      mapLayers: getAllMatches(matchContext, mapLayers),
    };
  }, [
    id,
    region_id,
    subgroup_id,
    year,
    metrics,
    scales,
    dataSources,
    mapLayers,
  ]);
}
