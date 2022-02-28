import ReactJson from "react-json-view";
import { useConfig, useMetricConfig } from "../../Dashboard/Config";
import useCurrentContext from "../../Dashboard/hooks/useCurrentContext";
import useMapSources from "../../Dashboard/Map/hooks/useMapSources";
import { useLangStore } from "../../Dashboard/i18n";

export default function DataSources({ options = [] }) {
  const app = useConfig("app");
  // const data = useData({ region_id: "states", type: "extent" });
  const context = useCurrentContext();
  const metrics = useMetricConfig();
  const mapSources = useMapSources();
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
