import { useChoroplethContext, useScale } from "../../hooks";
import { getStepsFromChunks, getLinearColorRamp } from "../utils";
import Color from "color";
import { useLocationStore } from "../../Locations";

/**
 * Returns layer style for choropleth fill layer
 * @param {LayerContext} context
 * @param {string} context.region_id
 * @param {string} context.metric_id
 * @param {string} context.subgroup_id
 * @param {string} context.year
 * @param {Array<Chunk>} context.chunks
 * @param {string} context.accessor
 * @param {Array<string|number>} context.steps
 * @param {function} context.color
 * @param {Array<number>} context.extent - [min, max] for the given context
 * @returns [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
const getChoroplethFillLayer = (context) => {
  const { chunks, region_id: region, accessor, steps } = context;
  const fillRule = chunks
    ? ["step", ["get", accessor(context)], ...steps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...steps];
  return {
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
  };
};

/**
 * Returns layer style for choropleth outlines layer
 * @param {LayerContext} context
 * @param {string} context.region_id
 * @param {string} context.metric_id
 * @param {string} context.subgroup_id
 * @param {string} context.year
 * @param {Array<Chunk>} context.chunks
 * @param {string} context.accessor
 * @param {Array<string|number>} context.steps
 * @param {function} context.color
 * @param {Array<number>} context.extent - [min, max] for the given context
 * @returns [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
const getChoroplethOutlineLayer = (context) => {
  const { chunks, region_id: region, accessor, steps } = context;
  const outlineSteps = steps.map((step, i) => {
    if (Number.isFinite(step)) return step;
    const c = Color(step);
    return c.luminosity() > 0.5
      ? c.darken(0.25).rgb().string()
      : c.lighten(0.25).rgb().string();
  });
  const lineRule = chunks
    ? ["step", ["get", accessor(context)], ...outlineSteps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...outlineSteps];
  return {
    id: `${region}-outline`,
    source: `${region}_choropleth`,
    "source-layer": region,
    type: "line",
    paint: {
      "line-color": [
        "case",
        ["!=", ["get", accessor(context)], null],
        lineRule,
        "#ccc",
      ],
      "line-width": 1,
    },
    beforeId: "road-label",
  };
};

/**
 * Returns array of layer styles for choropleth hover layer
 * @param {LayerContext} context
 * @param {string} context.region_id
 * @param {string} context.metric_id
 * @param {string} context.subgroup_id
 * @param {string} context.year
 * @param {Array<Chunk>} context.chunks
 * @param {string} context.accessor
 * @param {Array<string|number>} context.steps
 * @param {function} context.color
 * @param {Array<number>} context.extent - [min, max] for the given context
 * @returns {Array<mapboxgl.Layer>} [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
const getChoroplethHoverLayers = (context) => {
  const { chunks, region_id: region, accessor, steps } = context;
  const outlineSteps = steps.map((step, i) => {
    if (Number.isFinite(step)) return step;
    const c = Color(step);
    return c.luminosity() > 0.5
      ? c.darken(0.25).rgb().string()
      : c.lighten(0.25).rgb().string();
  });
  const lineRule = chunks
    ? ["step", ["get", accessor(context)], ...outlineSteps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...outlineSteps];
  return [
    {
      id: `${region}-hoverCasing`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      paint: {
        "line-color": "#fff",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          5,
          0,
        ],
      },
      beforeId: "road-label",
    },
    {
      id: `${region}-hoverOutline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          lineRule,
          "#ccc",
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          0,
        ],
      },
      beforeId: "road-label",
    },
  ];
};

/**
 * Returns array of layer styles for choropleth hover layer
 * @param {LayerContext} context
 * @param {string} context.region_id
 * @param {string} context.metric_id
 * @param {string} context.subgroup_id
 * @param {string} context.year
 * @param {Array<Chunk>} context.chunks
 * @param {string} context.accessor
 * @param {Array<string|number>} context.steps
 * @param {function} context.color
 * @param {Array<number>} context.extent - [min, max] for the given context
 * @returns {Array<mapboxgl.Layer>} [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
const getChoroplethSelectedLayers = (context) => {
  const locationColors = ["#333", "#666", "#999", "#ccc"];
  const { chunks, region_id: region, accessor, steps } = context;
  const selectedIds = context.selected.map((f) => f.properties.GEOID);
  console.log("selected ids", selectedIds);
  return [
    {
      id: `${region}-selectedCasing`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      filter: ["in", "GEOID", ...selectedIds],
      paint: {
        "line-color": "#fff",
        "line-width": 5,
      },
      beforeId: "road-label",
    },
    {
      id: `${region}-selectedOutline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      filter: ["in", "GEOID", ...selectedIds],
      paint: {
        "line-color": "#f00",
        "line-width": 3,
      },
      beforeId: "road-label",
    },
  ];
};

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useChoroplethLayers(accessor) {
  const context = useChoroplethContext();
  const scale = useScale(context);
  const selected = useLocationStore((state) => state.selected);
  const {
    color,
    chunks,
    ScaleProps: { min, max },
  } = scale;
  const extent = [min, max];
  const steps = chunks
    ? getStepsFromChunks(chunks)
    : getLinearColorRamp(extent, color.copy().domain([0, 1]), 24);
  const layerContext = {
    ...context,
    extent,
    steps,
    chunks,
    color,
    accessor,
    selected,
  };
  const choroplethFillLayer = getChoroplethFillLayer(layerContext);
  const choroplethOutlineLayer = getChoroplethOutlineLayer(layerContext);
  const choroplethHoverLayers = getChoroplethHoverLayers(layerContext);
  const choroplethSelectedLayers = getChoroplethSelectedLayers(layerContext);
  const layers = [
    choroplethFillLayer,
    choroplethOutlineLayer,
    ...choroplethHoverLayers,
    ...choroplethSelectedLayers,
  ];
  return layers;
}
