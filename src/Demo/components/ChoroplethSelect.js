import React from "react";
import { useMetricConfig } from "../../Dashboard/Config";
import useDashboardStore from "../../Dashboard/store";
import { useLang, useLangObject } from "../../Dashboard/i18n";
import shallow from "zustand/shallow";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { styled } from "@mui/system";

const Select = styled(MuiSelect, { slot: "Root" })({
  border: "none",
});

const ChoroplethSelect = (props) => {
  const metrics = useMetricConfig();
  const metricIds = metrics.map((m) => m.id);
  const metricLang = useLangObject(metricIds, { prefix: "METRIC_" });
  const [choroplethMetric, setChoroplethMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const handleChange = (event) => {
    setChoroplethMetric(event.target.value);
  };
  const label = useLang("SELECT_CHOROPLETH");
  const isReady = metrics.length > 0 && choroplethMetric;
  return (
    isReady && (
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="choropleth-label">{label}</InputLabel>
        <Select
          id="choropleth-select"
          labelId="choropleth-label"
          label={label}
          value={choroplethMetric}
          onChange={handleChange}
          autoWidth
          {...props}
        >
          {metrics
            .filter((o) => !o.unavailable)
            .map((metric, i) => (
              <MenuItem key={metric.id} value={metric.id}>
                {metricLang[metric.id]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    )
  );
};

ChoroplethSelect.propTypes = {};

export default ChoroplethSelect;
