import React from "react";
import useDashboardStore from "../../Dashboard/store";
import InlineMenu from "../components/InlineMenu";
import { useRegionConfig } from "../../Dashboard";
import { useMapState } from "@hyperobjekt/mapgl";
import { Divider, MenuItem, Switch, Typography } from "@mui/material";

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
  const setAutoSwitchRegion = useDashboardStore(
    (state) => state.setAutoSwitchRegion
  );
  const currentRegion = regions.find((r) => r.id === region);
  const map = useMapState("map");

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
    const isSwitchClick = event.target.type === "checkbox";
    if (isSwitchClick) event.stopPropagation();
  };
  return (
    <InlineMenu
      options={regions}
      variant="caption"
      fontWeight="bold"
      label={currentRegion.name}
      selected={region}
      onSelect={handleChange}
      {...props}
    >
      <Divider />
      <MenuItem onClick={handleToggleAutoSwitch}>
        <Typography variant="body2">Auto-switch on zoom</Typography>
        <Switch
          defaultChecked
          checked={autoSwitchRegion}
          onClick={handleToggleAutoSwitch}
        />
      </MenuItem>
    </InlineMenu>
  );
};

RegionSelect.propTypes = {};

export default RegionSelect;
