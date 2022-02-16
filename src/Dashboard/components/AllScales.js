import React from "react";
import { Scale } from ".";
import { useMetricConfig } from "../Config";
import { useCurrentContext } from "../hooks";
import { useLangObject } from "../i18n";

export default function AllScales() {
  const { region } = useCurrentContext();
  const metrics = useMetricConfig();
  const metricIds = metrics.map((m) => m.id);
  const labelLang = useLangObject(metricIds, { prefix: "METRIC_" });
  const unitLang = useLangObject(metricIds, { prefix: "UNIT_" });
  const descLang = useLangObject(metricIds, { prefix: "DESC_" });
  return (
    <>
      <h2>All Scales</h2>
      {metrics.map((metric) => {
        return (
          <React.Fragment key={metric.id}>
            <h3>{labelLang[metric.id]}</h3>
            {unitLang[metric.id] && <p>{unitLang[metric.id]}</p>}
            {descLang[metric.id] && <p>{descLang[metric.id]}</p>}
            <Scale key={metric.id} metric={metric.id} region={region} />
          </React.Fragment>
        );
      })}
    </>
  );
}
