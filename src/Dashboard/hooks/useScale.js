import { useMetricConfig, useScaleConfig } from "../Config";
import useDataSource from "../Data/useDataSource";
import { getScale } from "@hyperobjekt/scales";
import useColors from "./useColor";
import { getFormatter } from "../Formatters";

/**
 * Takes a context object and returns `ScaleProps`, `TickProps`, and scale functions
 * @param {*} context
 * @returns
 */
export default function useScale(context) {
  context.type = context.type || "choropleth";
  const defaultColor = useColors(context.type);
  const {
    extent_url,
    extent_min_key,
    extent_max_key,
    min,
    max,
    chunks,
    scale,
    colors,
  } = useScaleConfig(context);
  const { format, short_format } = useMetricConfig(context.metric_id);
  const formatType = short_format || format || "number";
  const tickFormat = getFormatter(formatType);
  const { isSuccess, data } = useDataSource({ url: extent_url }, { context });
  const metricEntry =
    isSuccess && data?.find((entry) => entry.id === context.metric_id);
  const minValue = (metricEntry && metricEntry[extent_min_key]) || min || 0;
  const maxValue = (metricEntry && metricEntry[extent_max_key]) || max || 1;
  const colorValue = colors || defaultColor;
  const scaleFns = getScale(scale, {
    min: minValue,
    max: maxValue,
    chunks,
    colors,
  });
  return {
    ScaleProps: {
      type: scale,
      min: minValue,
      max: maxValue,
      colors: colorValue,
      chunks,
    },
    TickProps: {
      ticks: chunks || scaleFns?.chunks?.length || 5,
      tickFormat,
    },
    ...scaleFns,
  };
}
