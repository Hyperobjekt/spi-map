import { FilterList } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useDashboardStore, Panel, SearchInput } from "../../Dashboard";
import useCategorizedMetrics from "./hooks/useCategorizedMetrics";
import useMetricSearch from "./hooks/useMetricSearch";
import MetricsList from "./MetricsList";
import useIndicatorPanelStore from "./store";

const StyledBox = styled(Box)({
  width: "100%",
  "& .MuiFormControlLabel-label": {
    fontSize: 12,
  },
});

const FooterActions = ({
  onCustomize,
  onToggleCustomized,
  hasCustomized,
  enableCustomized,
  ...props
}) => {
  return (
    <StyledBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      {...props}
    >
      {hasCustomized && (
        <FormControlLabel
          control={
            <Switch checked={enableCustomized} onClick={onToggleCustomized} />
          }
          label="Use Customized Indicators"
        />
      )}
      <Button
        fullWidth={!hasCustomized}
        variant="contained"
        size="small"
        color="primary"
        onClick={onCustomize}
      >
        {hasCustomized ? "Edit" : "Customize Indicators"}
      </Button>
    </StyledBox>
  );
};

export const IndicatorPanel = ({ ...props }) => {
  const [metric, setMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const setCustomizeOpen = useIndicatorPanelStore(
    (state) => state.setCustomizeOpen
  );
  const customizedMetrics = useIndicatorPanelStore(
    (state) => state.customizedMetrics
  );
  const hasCustomized = customizedMetrics.length > 0;
  const [enableCustomized, setEnableCustomized] = useIndicatorPanelStore(
    (state) => [state.enableCustomized, state.setEnableCustomized],
    shallow
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
  const handleCustomizeIndicators = () => {
    setCustomizeOpen(true);
  };
  const handleToggleCustomized = () => {
    console.count("toggle");
    setEnableCustomized(!enableCustomized);
  };
  const footerChildren = (
    <FooterActions
      onCustomize={handleCustomizeIndicators}
      onToggleCustomized={handleToggleCustomized}
      hasCustomized={hasCustomized}
      enableCustomized={enableCustomized}
    />
  );
  return (
    <Panel
      position="right"
      title="Social Progress Indicators"
      footerChildren={footerChildren}
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
