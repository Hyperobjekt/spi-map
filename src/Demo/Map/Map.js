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
  useMapSources,
  useChoroplethContext,
  useChoroplethLayers,
  useDashboardStore,
} from "../../Dashboard";
import {
  useLocationStore,
  useToggleSelectedLocation,
} from "../../Dashboard/Locations";
import MapAutoSwitch from "./MapAutoSwitch";
import CityLabelsLayer from "./CityLabelsLayer";

const TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

const MAP_STYLE = "mapbox://styles/hyperobjekt/cl007w05t000414oaog417i9s";

const createCircleLayers = (context) => {
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

export default function Map({ children, ...props }) {
  const ref = useRef(); // reference to mapgl instance (needed for sizing on panel open / close)
  const sources = useMapSources();
  const layers = useChoroplethLayers({ createLayers: createCircleLayers });
  const { region_id } = useChoroplethContext();
  const toggleSelected = useToggleSelectedLocation();
  const isSelected = useLocationStore((state) => state.isSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);

  console.log("hehe", ref.current?.getZoom());

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
      {autoSwitchRegion && <MapAutoSwitch />}
      <CityLabelsLayer />
      {children}
    </MapGL>
  );
}
