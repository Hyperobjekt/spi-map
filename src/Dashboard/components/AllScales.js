import React from "react";
import { Scale } from ".";
import { useMetricConfig } from "../Config";
import { useCurrentContext } from "../hooks";
import { useLangObject } from "../i18n";

export default function AllScales() {
  const { region } = useCurrentContext();
  const metrics = useMetricConfig();
  const metricIds = metrics.map((m) => m.id);
  const langObject = useLangObject(metricIds, { prefix: "METRIC_" });
  return (
    <>
      <h2>All Scales</h2>
      {metrics.map((metric) => {
        return (
          <React.Fragment key={metric.id}>
            <h3>{langObject[metric.id]}</h3>
            <Scale key={metric.id} metric={metric.id} region={region} />
          </React.Fragment>
        );
      })}
    </>
  );
}
