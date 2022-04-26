import React from "react";
import { Layer } from "react-map-gl";

// City labels using mapboxgl streets source
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

/**
 * Renders the city labels layer on the map
 * @returns
 */
const CityLabelsLayer = () => {
  return (
    <Layer {...CITY_LABELS} beforeId="settlement-subdivision-label"></Layer>
  );
};

export default CityLabelsLayer;
