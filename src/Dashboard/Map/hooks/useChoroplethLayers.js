import { useChoroplethContext, useScale } from "../../hooks";
import { getStepsFromChunks, getLinearColorRamp } from "../utils";
import Color from "color";
import { useLocationStore } from "../../Locations";
import { useAppConfig, useConfig } from "../../Config";
import useDashboardStore from "../../store";

const getLineWidths = (region) => {
  switch (region) {
    case "states":
      return [3, 1, 6, 2, 10, 4];
    case "cities":
      return [8, 1, 12, 4];
    case "tracts":
      return [10, 1, 20, 3];
    default:
      return [1, 1.5];
  }
};

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
const getChoroplethFillLayers = (context, regionsConfig) => {
  const { chunks, accessor, steps } = context;
  const fillRule = chunks
    ? ["step", ["get", accessor(context)], ...steps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...steps];
  return regionsConfig.map((regionConfig) => {
    return {
      id: `${regionConfig.id}-choropleth`,
      source: `${regionConfig.id}_choropleth`,
      "source-layer": regionConfig.id,
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          fillRule,
          "transparent",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          Math.max(0, regionConfig.min_zoom - 1),
          0,
          regionConfig.min_zoom,
          1,
          regionConfig.max_zoom,
          1,
          regionConfig.max_zoom + 1,
          0,
        ],
      },
      beforeId: "water",
      interactive: true,
    };
  });
};

/**
 * Gets a complementary color when provided a color string, used for outlines
 * @param {*} color
 * @returns
 */
const getComplementaryColor = (color) => {
  const c = Color(color);
  const luminosity = c.luminosity();
  if (luminosity > 0.8) return c.darken(0.2).desaturate(0.25).rgb().string();
  if (luminosity > 0.5) return c.darken(0.1).desaturate(0.1).rgb().string();
  if (luminosity > 0.25) return c.lighten(0.1).rgb().string();
  if (luminosity > 0.1) return c.lighten(0.4).rgb().string();
  return c.lightness(40).desaturate(0.25).rgb().string();
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
export const getChoroplethOutlineLayers = (context) => {
  const { chunks, region_id: region, accessor, steps } = context;
  const outlineSteps = steps.map((step, i) => {
    if (Number.isFinite(step)) return step;
    return getComplementaryColor(step);
  });
  const lineRule = chunks
    ? ["step", ["get", accessor(context)], ...outlineSteps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...outlineSteps];
  return [
    {
      id: `${region}-outline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          lineRule,
          "transparent",
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          ...getLineWidths(region),
        ],
      },
      beforeId: "road-label-simple",
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
export const getChoroplethHoverLayers = (context) => {
  const { chunks, region_id: region, accessor, steps, hoverColor } = context;
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
      beforeId: "road-label-simple",
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
          hoverColor === "auto" ? lineRule : hoverColor,
          "#ccc",
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          0,
        ],
      },
      beforeId: "road-label-simple",
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
export const getChoroplethSelectedLayers = (context) => {
  const { region_id: region, selected } = context;
  const selectedIds = selected.map((f) => f?.properties?.GEOID);
  // reduce selected features into a "case" expression to color features based on GEOID and color property
  const caseRules = selected.reduce(
    (rules, f, i) => {
      rules.push(["==", ["get", "GEOID"], f.properties.GEOID]);
      rules.push(f.properties.color);
      // last color is default, which technically should never be used (because of the `filter`)
      if (i === selected.length - 1) rules.push("#ccc");
      return rules;
    },
    ["case"]
  );
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
      beforeId: "road-label-simple",
    },
    {
      id: `${region}-selectedOutline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      filter: ["in", "GEOID", ...selectedIds],
      paint: {
        "line-color": caseRules.length > 2 ? caseRules : "transparent",
        "line-width": 3,
      },
      beforeId: "road-label-simple",
    },
  ];
};
const GET_VARIABLE_NAME = (context) => {
  return context?.metric_id;
};

export function useChoroplethLayerContext(accessor = GET_VARIABLE_NAME) {
  const context = useChoroplethContext();
  const scale = useScale(context);
  const autoSwitch = useDashboardStore((state) => state.autoSwitchRegion);
  const selected = useLocationStore((state) => state.selected);
  const hoverColor = useAppConfig("hover_color");
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
    accessor,
    selected,
    hoverColor,
    autoSwitch,
  };
}

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useChoroplethLayers({
  accessor = GET_VARIABLE_NAME,
  createLayers,
}) {
  const layerContext = useChoroplethLayerContext(accessor);
  const regionsConfig = useConfig("regions");
  const choroplethFillLayers = getChoroplethFillLayers(
    layerContext,
    regionsConfig
  );
  const choroplethOutlineLayers = getChoroplethOutlineLayers(layerContext);
  const choroplethHoverLayers = getChoroplethHoverLayers(layerContext);
  const choroplethSelectedLayers = getChoroplethSelectedLayers(layerContext);
  const extraLayers =
    typeof createLayers === "function" ? createLayers(layerContext) : [];
  const layers = [
    ...choroplethFillLayers,
    ...choroplethOutlineLayers,
    ...choroplethHoverLayers,
    ...choroplethSelectedLayers,
    ...extraLayers,
  ];
  return layers;
}
