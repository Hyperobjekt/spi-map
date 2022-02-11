import useMetricConfig from "../Config/hooks/useMetricConfig";

export default function useMetric(id, { region, year, subgroup }) {
  const metric = useMetricConfig(id);

  // const metric = useMetric(id);
  // const extent = getMetricExtent(metric, data);
  // const colorScale = getMetricColorScale(metric, extent);
  // const positionScale = getMetricPositionScale(metric, extent);
  // const formatter = getMetricFormatter(metric, extent);
  // const shortFormatter = getMetricShortFormatter(metric, extent);
  // return {
  //   ...metric,
  //   data,
  //   extent,
  //   colorScale,
  //   positionScale,
  //   formatter,
  //   shortFormatter,
  // };
}
