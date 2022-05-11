import React, { useCallback, useRef } from 'react';
import { MapGL, useMapFlyToFeature, ZoomToBoundsControl } from '@hyperobjekt/mapgl';
import { GeolocateControl, NavigationControl } from 'react-map-gl';
import { useMapSources, useDashboardStore } from '@hyperobjekt/react-dashboard';
import { useLocationStore, useToggleLocation } from '@hyperobjekt/react-dashboard';
import MapAutoSwitch from './components/MapAutoSwitch';
import CityLabelsLayer from './components/CityLabelsLayer';
import useSpiMapLayers from './hooks/useSpiMapLayers';

const TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

const MAP_STYLE = 'mapbox://styles/hyperobjekt/cl007w05t000414oaog417i9s';

export default function Map({ children, ...props }) {
  const ref = useRef(); // reference to mapgl instance (needed for sizing on panel open / close)
  const sources = useMapSources();
  const layers = useSpiMapLayers();
  const toggleSelected = useToggleLocation();
  const isSelected = useLocationStore((state) => state.isSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);

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
    [flyToFeature, isSelected, toggleSelected],
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
      // interactiveLayerIds={[`${region_id}-choropleth`, `city-bubbles`]}
      {...props}
    >
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
      {autoSwitchRegion && <MapAutoSwitch />}
      <CityLabelsLayer />
      {children}
    </MapGL>
  );
}
