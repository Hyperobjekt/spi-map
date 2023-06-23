import React, { useEffect, useState } from 'react';
import { useRegionConfig, useDashboardStore } from '@hyperobjekt/react-dashboard';
import { useMapState } from '@hyperobjekt/mapgl';
import { useLocationStore } from '@hyperobjekt/react-dashboard';
import { InlineMenu } from '../components';
import useAppStore from 'App/store';

/**
 * Renders an inline menu for selecting the region, with an
 * additional option to toggle auto-switch regions based on zoom level.
 * @param {*} props
 * @returns
 */
const RegionSelect = (props) => {
  const regions = useRegionConfig();
  const region = useDashboardStore((state) => state.region);
  const setRegion = useDashboardStore((state) => state.setRegion);
  const currentRegion = regions.find((r) => r.id === region);
  const map = useMapState('map');
  const selected = useLocationStore((state) => state.selected);
  const role = useAppStore((state) => state.role);

  // Stores the selected cities/states so toggling regions back and forth will keep previous state
  const [cachedSelection, setCachedSelection] = useState({ cities: [], states: [], tracts: [] });

  useEffect(() => {
    setCachedSelection((x) => ({ ...x, [region]: selected }));
  }, [region, selected]);

  const handleChange = (event, option) => {
    if (region === option.id) return;
    useLocationStore.setState({ selected: cachedSelection[option.id] });
    option?.id && setRegion(option.id);
    // HACK: force a slight zoom so the map re-renders (otherwise, the map is blank until the user moves it)
    map?.zoomTo(map?.getZoom() - 0.001);
  };

  return (
    <InlineMenu
      options={
        process.env.NODE_ENV === 'development' || role === 'Premium Plus'
          ? regions
          : regions.filter((x) => x.id !== 'tracts')
      }
      variant={'string'}
      fontWeight="bold"
      label={currentRegion.name}
      selected={region}
      onSelect={handleChange}
      {...props}
    />
  );
};

RegionSelect.propTypes = {};

export default RegionSelect;
