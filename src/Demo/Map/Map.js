import React, { useCallback, useRef } from "react";
import Color from "color";
import {
  MapGL,
  useMapFlyToFeature,
  ZoomToBoundsControl,
} from "@hyperobjekt/mapgl";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import {
  useMapLayers,
  useMapSources,
  useChoroplethContext,
  useChoroplethLayers,
} from "../../Dashboard";
import {
  useLocationStore,
  useToggleSelectedLocation,
} from "../../Dashboard/Locations";
import { Layer } from "react-map-gl";

const TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

const MAP_STYLE = "mapbox://styles/hyperobjekt/cl007w05t000414oaog417i9s";

const CITY_LABEL_LAYER = {
  id: "cities-label",
  type: "symbol",
  source: "cities_choropleth",
  "source-layer": "cities-centers",
  minzoom: 3,
  maxzoom: 15,
  filter: [
    "all",
    [
      "step",
      ["zoom"],
      false,
      3,
      [">=", ["get", "CENSUSAREA"], 300],
      5,
      [">", ["get", "CENSUSAREA"], 200],
      6,
      [">", ["get", "CENSUSAREA"], 100],
      8,
      [">", ["get", "CENSUSAREA"], 20],
      10,
      [">", ["get", "CENSUSAREA"], 10],
      12,
      [">=", ["get", "CENSUSAREA"], 0],
    ],
  ],
  layout: {
    "text-line-height": 1.1,
    "text-size": [
      "interpolate",
      ["cubic-bezier", 0.2, 0, 0.9, 1],
      ["zoom"],
      3,
      12,
      6,
      14,
      15,
      18,
    ],
    "text-radial-offset": 0,
    "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"],
    "text-justify": "center",
    "text-anchor": "center",
    "text-field": [
      "case",
      [">=", ["index-of", "(balance)", ["get", "name"]], 0],
      ["slice", ["get", "name"], 0, ["index-of", " ", ["get", "name"]]],
      ["get", "name"],
    ],
    "text-max-width": 7,
  },
  paint: {
    "text-color": "#444",
    "text-halo-color": "hsl(185, 1%, 100%)",
    "text-halo-width": 1,
    "text-halo-blur": 1,
  },
};

const CITY_LABELS = {
  id: "settlement-major-label",
  type: "symbol",
  metadata: {
    "mapbox:featureComponent": "place-labels",
    "mapbox:group": "Place labels, place-labels",
  },
  source: "composite",
  "source-layer": "place_label",
  minzoom: 3,
  maxzoom: 15,
  filter: [
    "all",
    ["<=", ["get", "filterrank"], 3],
    [
      "match",
      ["get", "class"],
      "settlement",
      ["match", ["get", "worldview"], ["all", "US"], true, false],
      "disputed_settlement",
      [
        "all",
        ["==", ["get", "disputed"], "true"],
        ["match", ["get", "worldview"], ["all", "US"], true, false],
      ],
      false,
    ],
    [
      "step",
      ["zoom"],
      false,
      3,
      ["<=", ["get", "symbolrank"], 6],
      4,
      ["<", ["get", "symbolrank"], 8],
      5,
      ["<", ["get", "symbolrank"], 9],
      7,
      ["<", ["get", "symbolrank"], 10],
      10,
      ["<", ["get", "symbolrank"], 11],
      11,
      ["<", ["get", "symbolrank"], 13],
      12,
      ["<", ["get", "symbolrank"], 15],
      13,
      [">=", ["get", "symbolrank"], 11],
      14,
      [">=", ["get", "symbolrank"], 15],
    ],
  ],
  layout: {
    "text-line-height": 1.1,
    "text-size": [
      "interpolate",
      ["cubic-bezier", 0.2, 0, 0.9, 1],
      ["zoom"],
      3,
      ["step", ["get", "symbolrank"], 13, 6, 12],
      6,
      ["step", ["get", "symbolrank"], 16, 6, 15, 7, 14],
      8,
      ["step", ["get", "symbolrank"], 18, 9, 17, 10, 15],
      15,
      [
        "step",
        ["get", "symbolrank"],
        23,
        9,
        22,
        10,
        20,
        11,
        18,
        12,
        16,
        13,
        15,
        15,
        13,
      ],
    ],
    "text-radial-offset": [
      "step",
      ["zoom"],
      ["match", ["get", "capital"], 2, 0.6, 0.55],
      8,
      0,
    ],

    "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"],
    "text-justify": [
      "step",
      ["zoom"],
      [
        "match",
        ["get", "text_anchor"],
        ["left", "bottom-left", "top-left"],
        "left",
        ["right", "bottom-right", "top-right"],
        "right",
        "center",
      ],
      8,
      "center",
    ],
    "text-anchor": ["step", ["zoom"], ["get", "text_anchor"], 8, "center"],
    "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
    "text-max-width": 7,
  },
  paint: {
    "text-color": "#444444",
    "text-halo-color": "hsl(185, 1%, 100%)",
    "text-halo-width": 1,
    "text-halo-blur": 1,
  },
};

const createCircleLayers = (context) => {
  const { chunks, region_id: region, accessor, steps, hoverColor } = context;
  if (region === "cities") return [];
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
        "circle-opacity": 1,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
      beforeId: "road-label-simple",
      interactive: true,
    },
    {
      id: `cities-bubble-hoverCasing`,
      source: `cities_choropleth`,
      "source-layer": "cities-centers",
      type: "circle",
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

export default function Map({ children, ...props }) {
  const ref = useRef(); // reference to mapgl instance (needed for sizing on panel open / close)
  const sources = useMapSources();
  const layers = useChoroplethLayers({ createLayers: createCircleLayers });
  const { region_id } = useChoroplethContext();
  const toggleSelected = useToggleSelectedLocation();
  const isSelected = useLocationStore((state) => state.isSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();

  // fly to feature on click if it's not selected and toggle "selected" status
  const handleClick = useCallback(
    ({ features }) => {
      const partFeature = features?.[0];
      if (!partFeature) return;
      // fly to states
      partFeature.properties.GEOID.length === 2 &&
        !isSelected(partFeature) &&
        flyToFeature(partFeature);
      toggleSelected(partFeature);
    },
    [flyToFeature, isSelected, toggleSelected]
  );

  return (
    <MapGL
      ref={ref}
      mapboxAccessToken={TOKEN}
      sources={sources}
      layers={layers}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      bounds={US_BOUNDS}
      interactiveLayerIds={[`${region_id}-choropleth`, `city-bubbles`]}
      {...props}
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
      <Layer {...CITY_LABELS} beforeId="settlement-subdivision-label"></Layer>
      {children}
    </MapGL>
  );
}
