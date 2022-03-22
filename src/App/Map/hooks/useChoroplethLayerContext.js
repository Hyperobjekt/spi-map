import {
  useLocationStore,
  useAppConfig,
  useRegionConfig,
  useDashboardStore,
  useChoroplethContext,
  useChoroplethScale,
  getStepsFromChunks,
} from "@hyperobjekt/react-dashboard";
import { getPositionScale } from "@hyperobjekt/scales";

const GET_VARIABLE_NAME = (context) => {
  return context?.metric_id;
};

/**
 * Returns an array of position / color pairs to use for continuous
 * color gradients.
 * (e.g. for mapping values to colors)
 */
const getLinearColorRamp = (from, to, steps = 1) => {
  if (!from || !from[0] || !from[1]) from = [0, 1];
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = to;
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

export default function useChoroplethLayerContext({
  context: contextOverrides,
  scale: scaleOverrides,
}) {
  const context = useChoroplethContext(contextOverrides);
  const scale = useChoroplethScale(context, scaleOverrides);
  // console.log(scale, scaleOverrides);
  const autoSwitch = useDashboardStore((state) => state.autoSwitchRegion);
  const selected = useLocationStore((state) => state.selected);
  const hoverColor = useAppConfig("hover_color");
  const regionConfig = useRegionConfig(context.region_id);
  const {
    color,
    chunks,
    ScaleProps: { min, max },
  } = scale;
  const extent = [min, max];
  const steps = chunks
    ? getStepsFromChunks(chunks)
    : getLinearColorRamp(extent, color.copy().domain([0, 1]), 24);
  return {
    ...context,
    extent,
    steps,
    chunks,
    color,
    accessor: contextOverrides?.accessor || GET_VARIABLE_NAME,
    selected,
    hoverColor,
    autoSwitch,
    zoomBuffer: 1,
    min_zoom: regionConfig?.min_zoom || 0,
    max_zoom: regionConfig?.max_zoom || 20,
    ...contextOverrides,
  };
}
