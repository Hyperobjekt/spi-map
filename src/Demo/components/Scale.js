import { Scale as HypScale } from "@hyperobjekt/scales";
import { useScale } from "../../Dashboard/hooks";

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
  const { ScaleProps, TickProps } = useScale({
    metric_id: metric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type,
  });
  return (
    <HypScale margin={DEFAULT_MARGIN} nice {...ScaleProps} {...props}>
      <HypScale.Colors />
      <HypScale.Ticks {...TickProps} />
      {children}
    </HypScale>
  );
}
