import { FilterList } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useDashboardStore } from "@hyperobjekt/react-dashboard";
import useCategorizedMetrics from "./hooks/useCategorizedMetrics";
import useMetricSearch from "./hooks/useMetricSearch";
import MetricsList from "./MetricsList";
import useIndicatorPanelStore from "./store";
import { Panel, SearchInput } from "../components";
import { CustomizeIndicatorsToggle } from "./components";

export const IndicatorPanel = ({ ...props }) => {
  const [metric, setMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const customizedMetrics = useIndicatorPanelStore(
    (state) => state.customizedMetrics
  );
  const hasCustomized = customizedMetrics.length > 0;
  const enableCustomized = useIndicatorPanelStore(
    (state) => state.enableCustomized
  );
  const [expanded, setExpanded] = useState(["bhn", "fow", "opp"]);
  const {
    filter,
    highlight,
    matchCount,
    handleFilterChange,
    handleFilterClear,
  } = useMetricSearch();
  const metrics = useCategorizedMetrics();
  // set the filter to be customized metrics if they are set and there is no search highlight
  const filteredItems =
    enableCustomized && hasCustomized && !highlight
      ? customizedMetrics
      : filter;

  // expand the default choropleth metric catgegory if needed
  useEffect(() => {
    const parts = metric.split("_");
    if (parts.length > 1 && !expanded.includes(parts[0])) {
      setExpanded([...expanded, parts[0]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectMetric = (event, id) => {
    setMetric(id);
    // expand the selected metric if it's not already expanded
    if (!expanded.includes(id)) {
      setExpanded([...expanded, id]);
    }
  };
  const handleToggleExpanded = (event, id) => {
    const isRemoving = expanded.includes(id);
    const newValue = isRemoving
      ? expanded.filter((e) => e !== id)
      : [...expanded, id];
    setExpanded(newValue);
    event.stopPropagation();
    event.preventDefault();
  };
  const handleExpandAll = () => {
    const ids = metrics.reduce((idArray, metric) => {
      idArray.push(metric.id);
      if (metric.children) {
        idArray.push(...metric.children.map((child) => child.id));
      }
      return idArray;
    }, []);
    setExpanded(ids);
  };
  const handleExpandNone = () => {
    setExpanded([]);
  };

  return (
    <Panel
      position="right"
      title="Social Progress Indicators"
      footerChildren={<CustomizeIndicatorsToggle />}
      {...props}
    >
      <Box p={2}>
        <SearchInput
          icon={<FilterList />}
          placeholder="Filter indicators…"
          onChange={handleFilterChange}
          onClear={handleFilterClear}
        />
        {highlight && (
          <Box display="flex" alignItems="center" height={32} mt={2}>
            <Typography variant="body2">
              Showing {matchCount} matching indicators.
            </Typography>
          </Box>
        )}
        {!highlight && (
          <Box
            display="flex"
            alignItems="center"
            height={32}
            gap={2}
            color="grey.600"
            mt={2}
          >
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="inherit"
              onClick={handleExpandAll}
            >
              Expand all
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="inherit"
              onClick={handleExpandNone}
            >
              Collapse all
            </Button>
          </Box>
        )}
      </Box>
      <MetricsList
        disablePadding
        items={metrics}
        selected={[metric]}
        expanded={expanded}
        filter={filteredItems}
        highlight={highlight}
        collapseDepths={hasCustomized && enableCustomized ? [] : [0, 1]}
        onSelect={handleSelectMetric}
        onToggleExpanded={handleToggleExpanded}
      />
    </Panel>
  );
};
