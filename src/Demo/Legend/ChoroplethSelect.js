import React, { useEffect, useState } from "react";
import { useMetricConfig } from "../../Dashboard/Config";
import useDashboardStore from "../../Dashboard/store";
import shallow from "zustand/shallow";
import InlineMenu from "../components/InlineMenu";
import { useIndicatorPanelStore } from "../IndicatorPanel";

const DEFAULT_METRICS = ["bhn", "fow", "opp"];

const ChoroplethSelect = (props) => {
  const metrics = useMetricConfig();
  const [choroplethMetric, setChoroplethMetric] = useDashboardStore(
    (state) => [state.choroplethMetric, state.setChoroplethMetric],
    shallow
  );
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow
  );
  const [history, setHistory] = useState(DEFAULT_METRICS);
  const currentMetric = metrics.find((m) => m.id === choroplethMetric);

  // add indicators to this history when new ones are selected
  useEffect(() => {
    if (!choroplethMetric) return;
    const newHistory = [
      choroplethMetric,
      ...history.filter((h) => h !== choroplethMetric),
    ];
    if (shallow(history, newHistory)) return;
    setHistory(newHistory);
  }, [choroplethMetric, history, setHistory]);

  // select that 7 most recently selected indicators from the history
  const indicatorOptions = history
    .slice(0, 7)
    .map((id) => metrics.find((m) => m.id === id));

  // add more option if the indicators panel is closed
  const options = indicatorsOpen
    ? indicatorOptions
    : [
        ...indicatorOptions,
        {
          id: "more",
          name: "Show all indicators",
          className: "more",
        },
      ];

  // open the indicators panel if more option selected,
  // otherwise set the choropleth metric
  const handleChange = (event, option) => {
    if (option?.id === "more") {
      return setIndicatorsOpen(true);
    }
    option?.id && setChoroplethMetric(option.id);
  };
  return (
    <InlineMenu
      options={options}
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
