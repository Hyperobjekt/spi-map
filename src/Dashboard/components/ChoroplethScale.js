import { Scale } from ".";
import { useCurrentContext } from "../hooks";

export default function ChoroplethScale() {
  const {
    choroplethMetric: metric,
    subgroup,
    region,
    year,
  } = useCurrentContext();
  return <Scale {...{ metric, subgroup, region, year, type: "choropleth" }} />;
}
