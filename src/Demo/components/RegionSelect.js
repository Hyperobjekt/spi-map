import React from "react";
import useDashboardStore from "../../Dashboard/store";
import shallow from "zustand/shallow";
import InlineMenu from "./InlineMenu";
import { useRegionConfig } from "../../Dashboard";

const RegionSelect = (props) => {
  const regions = useRegionConfig();
  const [region, setRegion] = useDashboardStore(
    (state) => [state.region, state.setRegion],
    shallow
  );
  const currentRegion = regions.find((r) => r.id === region);
  const handleChange = (event, option) => {
    option?.id && setRegion(option.id);
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
