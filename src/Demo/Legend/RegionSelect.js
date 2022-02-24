import React from "react";
import useDashboardStore from "../../Dashboard/store";
import shallow from "zustand/shallow";
import InlineMenu from "../components/InlineMenu";
import { useRegionConfig } from "../../Dashboard";
import { useMapState } from "@hyperobjekt/mapgl";
const RegionSelect = (props) => {
  const regions = useRegionConfig();
  const region = useDashboardStore((state) => state.region, shallow);
  const currentRegion = regions.find((r) => r.id === region);
  const map = useMapState("map");
  const handleChange = (event, option) => {
    // option?.id && setRegion(option.id);
    const regionConfig = regions.find((r) => r.id === option.id);
    regionConfig &&
      region !== option.id &&
      map.flyTo({ zoom: regionConfig.target_zoom });
  };
  return (
    <InlineMenu
      options={regions}
      variant="caption"
      fontWeight="bold"
      selected={region}
      onSelect={handleChange}
      {...props}
    >
      {currentRegion.name}
    </InlineMenu>
  );
};

RegionSelect.propTypes = {};

export default RegionSelect;
