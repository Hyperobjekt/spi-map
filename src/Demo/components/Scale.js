import { Scale as HypScale } from "@hyperobjekt/scales";
import { useScale } from "../../Dashboard/hooks";
import useSpiScaleOverrides from "../hooks/useSpiScaleOverrides";

// default margin for scale
const DEFAULT_MARGIN = { left: 16, right: 16, top: 0, bottom: 0 };

/**
 * Renders a scale with colors and ticks that corresponds to the provided props
 */
export default function Scale({
  metric,
  subgroup,
  region,
  year,
  type = "choropleth",
  children,
  ...props
}) {
  const scaleOverrides = useSpiScaleOverrides({
    metric_id: metric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type,
  });
  const { ScaleProps, TickProps } = useScale(
    {
      metric_id: metric,
      subgroup_id: subgroup,
      region_id: region,
      year,
      type,
    },
    scaleOverrides
  );
  return (
    <HypScale
      style={{ marginTop: 8 }}
      margin={DEFAULT_MARGIN}
      {...ScaleProps}
      {...props}
    >
      {children}
      <HypScale.Colors />
      <HypScale.Ticks {...TickProps} />
    </HypScale>
  );
}
