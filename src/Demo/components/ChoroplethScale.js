import { Scale } from ".";
import { useCurrentContext } from "../../Dashboard/hooks";
import { useMapStore } from "@hyperobjekt/mapgl";
import { Scale as HypScale } from "@hyperobjekt/scales";
import { getFormatter } from "../../Dashboard";
import useMetricFormatter from "../../Dashboard/hooks/useMetricFormatter";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const Label = styled(Typography)({
  position: "absolute",
  top: -24,
  fontWeight: "bold",
});

export default function ChoroplethScale(props) {
  const {
    choroplethMetric: metric,
    subgroup,
    region,
    year,
  } = useCurrentContext();
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const formatter = useMetricFormatter(metric);
  const value = hoveredFeature?.properties?.[metric];
  return (
    <Scale
      {...{ metric, subgroup, region, year, type: "choropleth" }}
      {...props}
    >
      <HypScale.Marker style={{ top: 5.5 }} value={value} color="#f00" pointer>
        {/* <Label variant="caption">{formatter(value)}</Label> */}
      </HypScale.Marker>
    </Scale>
  );
}
