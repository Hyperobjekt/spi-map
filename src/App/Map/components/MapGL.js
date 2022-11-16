import React, { useCallback, useRef } from 'react';
import { MapGL as HypMapGL, useMapFlyToFeature } from '@hyperobjekt/mapgl';
import { GeolocateControl, NavigationControl, AttributionControl } from 'react-map-gl';
import { useMapSources } from '@hyperobjekt/react-dashboard';
import { useLocationStore, useToggleLocation } from '@hyperobjekt/react-dashboard';
import CityLabelsLayer from './CityLabelsLayer';
import useSpiMapLayers from '../hooks/useSpiMapLayers';
import { MAPBOX_TOKEN, MAP_STYLE, US_BOUNDS } from '../../shared/constants';

export default function MapGL({ children, ...props }) {
  const ref = useRef(); // reference to mapgl instance (needed for sizing on panel open / close)
  const sources = useMapSources();
  const layers = useSpiMapLayers();
  const toggleSelected = useToggleLocation();
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
    [flyToFeature, isSelected, toggleSelected],
  );

  return (
    <HypMapGL
      ref={ref}
      mapboxAccessToken={MAPBOX_TOKEN}
      sources={sources}
      layers={layers}
      mapStyle={MAP_STYLE}
      onClick={handleClick}
      bounds={US_BOUNDS}
      attributionControl={false}
      // interactiveLayerIds={[`${region_id}-choropleth`, `city-bubbles`]}
      {...props}
    >
      <GeolocateControl />
      <NavigationControl />
      <AttributionControl customAttribution="Copyright © Social Progress Imperative, 2022" />
      <CityLabelsLayer />
      {children}
    </HypMapGL>
  );
}
