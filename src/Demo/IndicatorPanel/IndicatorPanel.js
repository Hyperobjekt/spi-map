import { FilterList } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import shallow from "zustand/shallow";
import { useDashboardStore } from "../../Dashboard";
import Panel from "../components/Panel";
import { SearchInput } from "../components/SearchInput";
import useCategorizedMetrics from "./hooks/useCategorizedMetrics";
import useMetricSearch from "./hooks/useMetricSearch";
import MetricsList from "./MetricsList";

export const IndicatorPanel = ({ ...props }) => {
  const [metric, setMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const [highlight, setHighlight] = useState("");
  const [filter, setFilter] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const search = useMetricSearch();
  const metrics = useCategorizedMetrics();
  const numMatches = highlight ? filter.length : -1;
  const handleFilterChange = (event) => {
    const newValue = event.target.value;
    const matches = search.search(newValue).map((m) => m.id);
    setHighlight(newValue);
    setFilter(matches);
  };
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
  const handleFilterClear = () => {
    setFilter([]);
    setHighlight("");
  };
  return (
    <Panel position="right" title="Social Progress Indicators" {...props}>
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
              Showing {numMatches} matching indicators.
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
              Show all
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
        filter={filter}
        highlight={highlight}
        collapseDepths={[0, 1]}
        onSelect={handleSelectMetric}
        onToggleExpanded={handleToggleExpanded}
      />
    </Panel>
  );
};
