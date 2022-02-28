import Color from "color";

export const createCircleLayers = (context) => {
  const { chunks, accessor, steps, hoverColor } = context;
  const fillRule = chunks
    ? ["step", ["get", accessor(context)], ...steps]
    : ["interpolate", ["linear"], ["get", accessor(context)], ...steps];
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
      id: `city-bubbles`,
      source: `cities_choropleth`,
      "source-layer": "cities-centers",
      type: "circle",
      minzoom: 2,
      maxzoom: 9,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          2,
          5,
          4,
          6,
          8,
          8,
          10,
          10,
          10,
        ],
        "circle-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          fillRule,
          "transparent",
        ],
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          3,
          1,
          8,
          1,
          9,
          0,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
        "circle-stroke-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          3,
          1,
          8,
          1,
          9,
          0,
        ],
      },
      beforeId: "road-label-simple",
      interactive: true,
    },
    {
      id: `cities-bubble-hoverCasing`,
      source: `cities_choropleth`,
      "source-layer": "cities-centers",
      type: "circle",
      minzoom: 2,
      maxzoom: 9,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          2,
          5,
          4,
          6,
          8,
          8,
          10,
          10,
          10,
        ],
        "circle-color": "transparent",
        "circle-stroke-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          3,
          1,
          8,
          1,
          9,
          0,
        ],
        "circle-stroke-color": "#fff",
        "circle-stroke-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          5,
          0,
        ],
      },
      beforeId: "road-label-simple",
    },
    {
      id: `cities-bubble-hoverOutline`,
      source: `cities_choropleth`,
      "source-layer": "cities-centers",
      type: "circle",
      minzoom: 2,
      maxzoom: 9,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          2,
          5,
          4,
          6,
          8,
          8,
          10,
          10,
          10,
        ],
        "circle-color": "transparent",
        "circle-stroke-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          3,
          1,
          8,
          1,
          9,
          0,
        ],
        "circle-stroke-color": [
          "case",
          ["!=", ["get", accessor(context)], null],
          hoverColor === "auto" ? lineRule : hoverColor,
          "#ccc",
        ],
        "circle-stroke-width": [
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
