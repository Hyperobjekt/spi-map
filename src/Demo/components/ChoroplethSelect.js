import React from "react";
import { useMetricConfig } from "../../Dashboard/Config";
import useDashboardStore from "../../Dashboard/store";
import shallow from "zustand/shallow";
import InlineMenu from "./InlineMenu";

const ChoroplethSelect = (props) => {
  const metrics = useMetricConfig();
  const [choroplethMetric, setChoroplethMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const currentMetric = metrics.find((m) => m.id === choroplethMetric);
  const handleChange = (event, option) => {
    option?.id && setChoroplethMetric(option.id);
  };
  return (
    <InlineMenu
      options={metrics}
      variant="body1"
      fontWeight="bold"
      lineHeight={1.2}
      selected={choroplethMetric}
      onSelect={handleChange}
    >
      {currentMetric?.name}
    </InlineMenu>
  );
};

ChoroplethSelect.propTypes = {};

export default ChoroplethSelect;
