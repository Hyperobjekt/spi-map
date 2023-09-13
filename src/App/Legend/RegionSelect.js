import React, { useEffect, useState } from 'react';
import { useRegionConfig, useDashboardStore, useLocationStore } from '@hyperobjekt/react-dashboard';
import { useMapState } from '@hyperobjekt/mapgl';
import { Divider, MenuItem, Switch, Typography } from '@mui/material';
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
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);
  const setAutoSwitchRegion = useDashboardStore((state) => state.setAutoSwitchRegion);
  const currentRegion = regions.find((r) => r.id === region);
  const map = useMapState('map');
  const selected = useLocationStore((state) => state.selected);
  const role = useAppStore((state) => state.role);

  // Stores the selected cities/states so toggling regions back and forth will keep previous state
  const [cachedSelection, setCachedSelection] = useState({ cities: [], states: [], tracts: [] });

  useEffect(() => {
    setCachedSelection((x) => ({ ...x, [region]: selected }));
  }, [region, selected]);

  // turns off auto switch when selecting a region, and activates the selected region
  const handleChange = (event, option) => {
    option?.id && setAutoSwitchRegion(false);
    option?.id && setRegion(option.id);
    // HACK: force a slight zoom so the map re-renders (otherwise, the map is blank until the user moves it)
    map?.zoomTo(map?.getZoom() - 0.001);
  };

  // toggles auto switch region behaviour
  const handleToggleAutoSwitch = (event) => {
    setAutoSwitchRegion(!autoSwitchRegion);
    // don't close the menu if toggling the switch
    const isSwitchClick = event.target.type === 'checkbox';
    if (isSwitchClick) event.stopPropagation();
  };

  const allowedRegions = {
    'Premium Plus': regions,
    Premium: regions.filter((x) => x.id !== 'tracts'),
    Basic: regions.filter((x) => x.id === 'states'),
  }[role];

  return (
    <InlineMenu
      options={allowedRegions}
      variant={'string'}
      fontWeight="bold"
      label={currentRegion.name}
      selected={region}
      onSelect={handleChange}
      {...props}
    >
      <Divider />
      <MenuItem onClick={handleToggleAutoSwitch}>
        <Typography variant="body2">Auto-switch on zoom</Typography>
        <Switch checked={autoSwitchRegion} onClick={handleToggleAutoSwitch} />
      </MenuItem>
    </InlineMenu>
  );
};

RegionSelect.propTypes = {};

export default RegionSelect;
