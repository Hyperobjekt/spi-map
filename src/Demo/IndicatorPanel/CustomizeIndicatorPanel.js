import { FilterList } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import shallow from "zustand/shallow";
import Panel from "../components/Panel";
import { SearchInput } from "../components/SearchInput";
import CheckboxMetricsList from "./CheckboxMetricsList";
import useCategorizedMetrics from "./hooks/useCategorizedMetrics";
import useMetricSearch from "./hooks/useMetricSearch";
import useIndicatorPanelStore from "./store";

/**
 * Renders "Apply" and "Cancel" buttons for the footer of the panel
 */
const FooterActions = ({ onApply, onCancel, ...props }) => {
  return (
    <Box
      display="flex"
      flex={1}
      gap={1}
      alignItems="center"
      justifyContent="space-between"
      px={2}
      {...props}
    >
      <Button
        fullWidth
        size="small"
        variant="contained"
        color="primary"
        onClick={onApply}
      >
        Apply
      </Button>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        color="primary"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Box>
  );
};

/**
 * Recursively gets all metric IDs from a tree
 * @param {*} tree
 * @returns
 */
const getIdsFromTree = (tree) => {
  const ids = [];
  if (tree.children) {
    tree.children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getIdsFromTree(child));
    });
  }
  return ids;
};

/**
 * Renders a panel with a metric tree with checkboxes for all metrics, and
 * a footer with Apply / Cancel buttons. Once applied, the global store is
 * updated with the selections.
 */
const CustomizeIndiactorPanel = ({ ...props }) => {
  // list of the current customized metrics, and the setter
  const [customizedMetrics, setCustomizedMetrics] = useIndicatorPanelStore(
    (state) => [state.customizedMetrics, state.setCustomizedMetrics],
    shallow
  );

  // setter for the panel's open / closed state
  const setCustomizeOpen = useIndicatorPanelStore(
    (state) => state.setCustomizeOpen
  );

  const setEnableCustomized = useIndicatorPanelStore(
    (state) => state.setEnableCustomized
  );

  // local state for selected options, these are copied to `customizedMetrics` on apply
  const [localSelections, setLocalSelections] = useState(customizedMetrics);

  // search results and handlers for metric search
  const {
    filter,
    highlight,
    matchCount,
    handleFilterChange,
    handleFilterClear,
  } = useMetricSearch();

  // metric tree by category
  const metrics = useCategorizedMetrics();

  // toggles metric in the customizedMetrics array when one is clicked
  const handleSelectMetric = (event, id) => {
    const newValue = localSelections.includes(id)
      ? localSelections.filter((e) => e !== id)
      : [...localSelections, id];
    setLocalSelections(newValue);
  };

  // adds all metric IDs to customized metrics when "Select all" is pressed
  const handleSelectAll = () => {
    const ids = getIdsFromTree({ id: "root", children: metrics });
    setLocalSelections(ids);
  };

  // removes all metric IDs from customized metrics when "Deselect all" is pressed
  const handleSelectNone = () => {
    setLocalSelections([]);
  };

  // set the customized metrics to the local selections, and close the panel
  const handleApplySelections = () => {
    setCustomizedMetrics(localSelections);
    if (localSelections.length > 0) setEnableCustomized(true);
    setCustomizeOpen(false);
  };

  // reset the local selections to the previous value, and close the panel
  const handleCancelSelections = () => {
    setLocalSelections(customizedMetrics);
    setCustomizeOpen(false);
  };

  // footer actions to pass to the Panel footer
  const footerActions = (
    <FooterActions
      onApply={handleApplySelections}
      onCancel={handleCancelSelections}
    />
  );

  return (
    <Panel
      position="right"
      float
      title="Customize Indicators"
      footerChildren={footerActions}
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
              onClick={handleSelectAll}
            >
              Select all
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="inherit"
              onClick={handleSelectNone}
            >
              Deselect all
            </Button>
          </Box>
        )}
      </Box>
      <CheckboxMetricsList
        disablePadding
        items={metrics}
        selected={localSelections}
        filter={filter}
        highlight={highlight}
        collapseDepths={[]}
        onSelect={handleSelectMetric}
      />
    </Panel>
  );
};

export default CustomizeIndiactorPanel;
