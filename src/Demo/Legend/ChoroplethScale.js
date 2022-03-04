import { Scale } from "../components";
import { useCurrentContext } from "../../Dashboard";
import { useMapStore } from "@hyperobjekt/mapgl";
import { Scale as HypScale } from "@hyperobjekt/scales";

export default function ChoroplethScale(props) {
  const {
    choroplethMetric: metric,
    subgroup,
    region,
    year,
  } = useCurrentContext();
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const value = hoveredFeature?.properties?.[metric];
  return (
    <Scale
      {...{ metric, subgroup, region, year, type: "choropleth" }}
      {...props}
    >
      <HypScale.Marker
        style={{ top: 5.5 }}
        value={value}
        color="#f00"
        pointer
      />
    </Scale>
  );
}
