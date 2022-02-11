import ReactJson from "react-json-view";
import { useConfig, useMetricConfig } from "../Config";
import useChoroplethScale from "../hooks/useChoroplethScale";
import useCurrentContext from "../hooks/useCurrentContext";
import useMapSources from "../hooks/useMapSources";
import { useLangStore } from "../i18n";

export default function DataSources({ options = [] }) {
  const app = useConfig("app");
  // const data = useData({ region_id: "states", type: "extent" });
  const context = useCurrentContext();
  const metrics = useMetricConfig();
  const mapSources = useMapSources();
  const choroplethScale = useChoroplethScale();
  const lang = useLangStore((state) => state.dict);
  const opts = {
    app,
    context,
    mapSources,
    choroplethScale,
    lang,
    metrics,
  };
  return (
    <>
      {options.map((option, idx) => {
        if (!opts[option]) return null;
        return <ReactJson key={idx} src={opts[option]} />;
      })}
    </>
  );
}
