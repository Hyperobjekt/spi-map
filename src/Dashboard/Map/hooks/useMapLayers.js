import { useScale } from "../../hooks";
import { useMapLayersConfig } from "../../Config";
import useCurrentContext from "../../hooks/useCurrentContext";
import { getStepsFromChunks, getLinearColorRamp } from "../utils";
const GET_VARIABLE_NAME = (context) => {
  return context?.metric_id;
};

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useChoroplethLayers(accessor = GET_VARIABLE_NAME) {
  const { choroplethMetric, subgroup, region, year } = useCurrentContext();
  const context = {
    metric_id: choroplethMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "choropleth",
  };
  const layerConfig = useMapLayersConfig(context);
  const scale = useScale(context);
  const {
    color,
    chunks,
    ScaleProps: { min, max },
  } = scale;
  const extent = [min, max];
  const steps = chunks
    ? getStepsFromChunks(chunks)
    : getLinearColorRamp(extent, color.range());
  const fillRule = chunks
    ? ["step", ["get", accessor(context)], ...steps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...steps];
  const layers = [
    {
      id: `${region}-choropleth`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          fillRule,
          "#ccc",
        ],
        "fill-opacity": 1,
      },
      beforeId: "water",
      interactive: true,
    },
    {
      id: `${region}-outline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          fillRule,
          "#ccc",
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          5,
          ["case", ["boolean", ["feature-state", "selected"], false], 5, 1],
        ],
      },
      beforeId: "road-label",
    },
  ];
  return layers;
}
