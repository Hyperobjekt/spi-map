import {
  getChoroplethLayers,
  useChoroplethContext,
  useChoroplethLayerContext,
  useDashboardStore,
} from "../../../Dashboard";
import useSpiScaleOverrides from "../../hooks/useSpiScaleOverrides";
import { createCircleLayers } from "../utils";

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useSpiMapLayers() {
  const currentContext = useChoroplethContext();
  const scaleOverrides = useSpiScaleOverrides(currentContext);
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);
  const layerContexts = {
    states: useChoroplethLayerContext({
      context: {
        region_id: "states",
        isActiveRegion: currentContext.region_id === "states",
      },
      scale: scaleOverrides,
    }),
    cities: useChoroplethLayerContext({
      context: {
        region_id: "cities",
        isActiveRegion: currentContext.region_id === "cities",
      },
      scale: scaleOverrides,
    }),
    tracts: useChoroplethLayerContext({
      context: {
        region_id: "tracts",
        isActiveRegion: currentContext.region_id === "tracts",
      },
      scale: scaleOverrides,
    }),
  };
  const bubbleContext = useChoroplethLayerContext({ scale: scaleOverrides });
  if (!autoSwitchRegion) {
    const layers = getChoroplethLayers(layerContexts[currentContext.region_id]);
    return layers;
  }
  // const regionsConfig = useConfig("regions");
  const allLayers = Object.keys(layerContexts)
    .map((region) => {
      return getChoroplethLayers(layerContexts[region]);
    })
    .flat()
    // ensure only the current choropleth region is interactive
    .map((layer) => {
      if (!layer.interactive) return layer;
      if (
        layer.interactive &&
        layer["source-layer"] === currentContext.region_id
      )
        return layer;
      return {
        ...layer,
        interactive: false,
      };
    });
  const circleLayers = createCircleLayers(bubbleContext);
  console.log({ allLayers, circleLayers });
  return [...allLayers, ...circleLayers];
}
