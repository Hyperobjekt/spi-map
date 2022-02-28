import union from "@turf/union";
import Color from "color";
import { getPositionScale } from "@hyperobjekt/scales";
import deepmerge from "deepmerge";

/**
 * Returns an array of from / to values with the given number of steps between.
 * (e.g. for mapping values to bubble radius)
 */
export const getLinearRamp = (from, to, steps = 1) => {
  // adjust from extent if values are equal
  if (from && from[0] === from[1]) from = [0, from[1]];
  if (from[0] === from[1]) from = [0, 1];
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = getPositionScale("linear", [0, 1], to);
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

/**
 * Returns an array of position / color pairs to use for continuous
 * color gradients.
 * (e.g. for mapping values to colors)
 */
export const getLinearColorRamp = (from, to, steps = 1) => {
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

/**
 * Takes the color "chunks" for the given color scale and returns
 * a color / value pair for each to use for fill styles.
 * @param {*} chunks
 * @returns
 */
export const getStepsFromChunks = (chunks) => {
  const steps = [];
  chunks.forEach((chunk, i) => {
    if (i === 0) steps.push(chunk.color);
    steps.push(chunk.value[0]);
    steps.push(chunk.color);
  });
  return steps;
};

/**
 * Takes multiple features and returns a single feature with the union of their geometry
 * @param {Array<GeoJSON.Feature>} features
 * @returns {GeoJSON.Feature}
 */
export const combineFeatures = (features) => {
  return features.length > 0
    ? features.reduce(
        (combined, f) =>
          combined ? union(combined, f, { properties: f.properties }) : f,
        null
      )
    : features;
};

/**
 * Get line width steps for different regions
 * @param {string} region
 * @returns {Array<number>} array of [zoom_level0, line_width0, zoom_level1, line_width1, ...]
 */
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
 * Returns layer style for choropleth fill layer
 * @param {LayerContext} context
 * @returns {Array<mapboxgl.Layer>} [layer]](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
export const getChoroplethFillLayers = (context) => {
  const {
    chunks,
    accessor,
    region_id: region,
    steps,
    zoomBuffer,
    beforeId = "water",
    min_zoom,
    max_zoom,
    autoSwitch,
  } = context;
  const fillRule = chunks
    ? ["step", ["get", accessor(context)], ...steps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...steps];
  // base layer where fills are visible at all zooms
  const baseLayer = {
    id: `${region}-choropleth`,
    source: `${region}_choropleth`,
    "source-layer": region,
    type: "fill",
    minzoom: 1,
    maxzoom: 24,
    paint: {
      "fill-color": [
        "case",
        ["!=", ["get", accessor(context)], null],
        fillRule,
        "transparent",
      ],
      "fill-opacity": 1,
    },
    beforeId,
    interactive: true,
  };
  // auto switch overrides so regions are only visible at certain zooms
  const autoSwitchOverrides = {
    minzoom: min_zoom - zoomBuffer,
    maxzoom: max_zoom + zoomBuffer,
    paint: {
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        min_zoom - zoomBuffer,
        0,
        min_zoom,
        1,
        max_zoom,
        1,
        max_zoom + zoomBuffer,
        0,
      ],
    },
  };
  // merge in the auto switch overrides if auto switch is enabled
  return [autoSwitch ? deepmerge(baseLayer, autoSwitchOverrides) : baseLayer];
};

/**
 * Returns layer style for choropleth outlines layer
 * @param {LayerContext} context
 * @returns {Array<mapboxgl.Layer>} [Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
export const getChoroplethOutlineLayers = (context) => {
  const {
    chunks,
    region_id: region,
    accessor,
    steps,
    min_zoom,
    max_zoom,
    zoomBuffer,
    beforeId = "road-label-simple",
  } = context;
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
        "line-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          min_zoom - zoomBuffer,
          0,
          min_zoom,
          1,
          max_zoom,
          1,
          max_zoom + zoomBuffer,
          0,
        ],
      },
      beforeId,
    },
  ];
};

/**
 * Returns array of layer styles for choropleth hover layer
 * @param {LayerContext} context
 * @returns {Array<mapboxgl.Layer>} [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
export const getChoroplethHoverLayers = (context) => {
  const {
    chunks,
    region_id: region,
    accessor,
    steps,
    hoverColor,
    beforeId = "road-label-simple",
    isActiveRegion,
  } = context;
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
      layout: {
        visibility: isActiveRegion ? "visible" : "none",
      },
      paint: {
        "line-color": "#fff",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          5,
          0,
        ],
      },
      beforeId,
    },
    {
      id: `${region}-hoverOutline`,
      source: `${region}_choropleth`,
      "source-layer": region,
      type: "line",
      layout: {
        visibility: isActiveRegion ? "visible" : "none",
      },
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
      beforeId,
    },
  ];
};

/**
 * Returns array of layer styles for choropleth selected outline layer
 * @param {LayerContext} context
 * @returns {Array<mapboxgl.Layer>} [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
export const getChoroplethSelectedLayers = (context) => {
  const {
    region_id: region,
    selected,
    beforeId = "road-label-simple",
  } = context;
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
      beforeId,
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
      beforeId,
    },
  ];
};

/**
 * Returns a series of layers for choropleths.
 * Includes the fill layer, outline layer, and layers for hover / selected states.
 * @param {*} layerContext
 * @returns
 */
export const getChoroplethLayers = (layerContext) => {
  const choroplethFillLayers = getChoroplethFillLayers(layerContext);
  const choroplethOutlineLayers = getChoroplethOutlineLayers(layerContext);
  const choroplethHoverLayers = getChoroplethHoverLayers(layerContext);
  const choroplethSelectedLayers = getChoroplethSelectedLayers(layerContext);
  return [
    ...choroplethFillLayers,
    ...choroplethOutlineLayers,
    ...choroplethHoverLayers,
    ...choroplethSelectedLayers,
  ];
};
