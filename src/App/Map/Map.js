import React, { useCallback, useRef } from 'react';
import { MapGL, useMapFlyToFeature, ZoomToBoundsControl, useMapStore } from '@hyperobjekt/mapgl';
import { GeolocateControl, NavigationControl } from 'react-map-gl';
import { useMapSources, useDashboardStore } from '@hyperobjekt/react-dashboard';
import { useLocationStore, useToggleLocation } from '@hyperobjekt/react-dashboard';
import { MAPBOX_TOKEN, MAP_STYLE } from 'App/shared/constants';
import MapAutoSwitch from './components/MapAutoSwitch';
import CityLabelsLayer from './components/CityLabelsLayer';
import useSpiMapLayers from './hooks/useSpiMapLayers';

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

export default function Map({ children, ...props }) {
  const ref = useRef(); // reference to mapgl instance (needed for sizing on panel open / close)
  const sources = useMapSources();
  const layers = useSpiMapLayers();
  const toggleSelected = useToggleLocation();
  const isSelected = useLocationStore((state) => state.isSelected);
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);
  const setViewState = useMapStore((state) => state.setViewState);

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
      mapboxAccessToken={MAPBOX_TOKEN}
      sources={sources}
      layers={layers}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      bounds={US_BOUNDS}
      // interactiveLayerIds={[`${region_id}-choropleth`, `city-bubbles`]}
      {...props}
    >
      <GeolocateControl />
      <NavigationControl
        onViewportChange={(viewport) => {
          setViewState(viewport);
        }}
      />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
      {autoSwitchRegion && <MapAutoSwitch />}
      <CityLabelsLayer />
      {children}
    </MapGL>
  );
}
