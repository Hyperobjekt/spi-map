import React from "react";
import { ListSubheader, TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useMetricConfig } from "../Config";
import useDashboardStore from "../store";
import { useLang, useLangObject } from "../i18n";
import shallow from "zustand/shallow";

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
  const unavailableLabel = useLang("LABEL_UNAVAILABLE");
  const isReady = metrics.length > 0 && choroplethMetric;
  return (
    isReady && (
      <TextField
        id="choropleth-select"
        select
        label={label}
        value={choroplethMetric}
        onChange={handleChange}
        {...props}
      >
        {metrics
          .filter((o) => !o.unavailable)
          .map((metric, i) => (
            <MenuItem key={metric.id} value={metric.id}>
              {metricLang[metric.id]}
            </MenuItem>
          ))}
        {/* {unavailableOptions.length > 0 && (
          <ListSubheader>{unavailableLabel}</ListSubheader>
        )}
        {unavailableOptions.map((metric, i) => (
          <MenuItem key={metric.id} value={metric.id} disabled>
            {metric.label}
          </MenuItem>
        ))} */}
      </TextField>
    )
  );
};

ChoroplethSelect.propTypes = {};

export default ChoroplethSelect;
