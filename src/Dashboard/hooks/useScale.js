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
    colors: colorValue,
  });
  const TickProps = { tickFormat };
  if (scaleFns?.chunks) {
    TickProps.endTicks = true;
    TickProps.tickValues = scaleFns.chunks.reduce((tickValues, chunk, i) => {
      if (i === 0) return tickValues;
      if (i === scaleFns.chunks.length - 1)
        return [...tickValues, chunk.value[0]];
      return [...tickValues, ...chunk.value];
    }, []);
  } else {
    TickProps.ticks = chunks || 5;
  }
  return {
    ScaleProps: {
      type: scale,
      min: minValue,
      max: maxValue,
      colors: colorValue,
      chunks,
    },
    TickProps,
    ...scaleFns,
  };
}
