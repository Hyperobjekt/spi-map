import { useScale } from "../../hooks";
import { getStepsFromChunks, getLinearColorRamp } from "../utils";
import { useLocationStore } from "../../Locations";
import { useAppConfig, useRegionConfig } from "../../Config";
import useDashboardStore from "../../store";
import useChoroplethContext from "./useChoroplethContext";

const GET_VARIABLE_NAME = (context) => {
  return context?.metric_id;
};

export default function useChoroplethLayerContext({
  context: contextOverrides,
  scale: scaleOverrides,
}) {
  const context = useChoroplethContext(contextOverrides);
  const scale = useScale(context, scaleOverrides);
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
