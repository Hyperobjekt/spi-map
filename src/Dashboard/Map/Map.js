import React, { useCallback } from "react";
import {
  MapGL,
  useMapFlyToFeature,
  ZoomToBoundsControl,
} from "@hyperobjekt/mapgl";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import { useMapLayers, useMapSources } from "../hooks";
import { useLocationStore } from "../Locations";
import { useMapStore } from "@hyperobjekt/mapgl";
import union from "@turf/union";
import SelectedLocationLayer from "./SelectedLocationLayer";

const LAYERS = [
  {
    id: "states-choropleth",
    source: "states_choropleth",
    "source-layer": "states",
    type: "fill",
    paint: {
      "fill-color": "rgba(255,0,0,1)",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "bhn"],
        50,
        0.1,
        80,
        0.8,
      ],
    },
    beforeId: "water",
    interactive: true,
  },
  {
    id: "states-outline",
    source: "states_choropleth",
    "source-layer": "states",
    type: "line",
    paint: {
      "line-color": "rgba(255,0,0,1)",
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

const layer = {
  id: "place-city-capital",
  type: "symbol",
  metadata: { "mapbox:group": "1444849242106.713" },
  source: "openmaptiles",
  "source-layer": "place",
  filter: ["all", ["==", "capital", 2], ["==", "class", "city"]],
  layout: {
    "icon-image": "star_11",
    "icon-size": 0.8,
    "text-anchor": "left",
    "text-field": "{name:latin}\n{name:nonlatin}",
    "text-font": ["Noto Sans Regular"],
    "text-max-width": 8,
    "text-offset": [0.4, 0],
    "text-size": {
      base: 1.2,
      stops: [
        [7, 14],
        [11, 24],
      ],
    },
    visibility: "visible",
  },
  paint: {
    "text-color": "#333",
    "text-halo-color": "rgba(255,255,255,0.8)",
    "text-halo-width": 1.2,
  },
};

const TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

const MAP_STYLE = "mapbox://styles/hyperobjekt/cke1roqr302yq19jnlpc8dgr9";

export default function Map({ ...props }) {
  const sources = useMapSources();
  const layers = useMapLayers();
  const map = useMapStore((state) => state.map);
  const toggleSelected = useLocationStore((state) => state.toggleSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();

  // fly to feature on click
  const handleClick = useCallback(
    ({ features }) => {
      const partFeature = features?.[0];
      if (!partFeature) return;
      flyToFeature(partFeature);
      toggleSelected(partFeature);
    },
    [flyToFeature]
  );

  return (
    <MapGL
      mapboxAccessToken={TOKEN}
      sources={sources}
      layers={layers}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      interactiveLayerIds={["states-choropleth"]}
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
      {/* <SelectedLocationLayer /> */}
    </MapGL>
  );
}
