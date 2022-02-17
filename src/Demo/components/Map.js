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
} from "react-map-gl";
import { useMapLayers, useMapSources } from "../../Dashboard/hooks";
import { useLocationStore } from "../../Dashboard/Locations";

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
  const toggleSelected = useLocationStore((state) => state.toggleSelected);
  const isSelected = useLocationStore((state) => state.isSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();

  // fly to feature on click
  const handleClick = useCallback(
    ({ features }) => {
      const partFeature = features?.[0];
      if (!partFeature) return;
      !isSelected(partFeature) && flyToFeature(partFeature);
      toggleSelected(partFeature);
    },
    [flyToFeature, isSelected, toggleSelected]
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
