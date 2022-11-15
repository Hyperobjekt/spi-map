import React from 'react';
import { useRegionConfig, useDashboardStore } from '@hyperobjekt/react-dashboard';
import { useMapState } from '@hyperobjekt/mapgl';
import { useLocationStore } from '@hyperobjekt/react-dashboard';
import { InlineMenu } from '../components';

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

  const handleChange = (event, option) => {
    if (region === option.id) return;
    useLocationStore.setState({ selected: [] });
    option?.id && setRegion(option.id);
    // HACK: force a slight zoom so the map re-renders (otherwise, the map is blank until the user moves it)
    map?.zoomTo(map?.getZoom() - 0.001);
  };

  return (
    <InlineMenu
      options={regions}
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
