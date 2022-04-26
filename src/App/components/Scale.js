import { Scale as HypScale } from "@hyperobjekt/scales";
import { useChoroplethScale } from "@hyperobjekt/react-dashboard";
import useSpiScaleOverrides from "../hooks/useSpiScaleOverrides";

// default margin for scale
const DEFAULT_MARGIN = { left: 16, right: 16, top: 0, bottom: 0 };

/**
 * Renders a scale with colors and ticks that corresponds to the provided props
 */
export default function Scale({
  metric_id,
  subgroup_id,
  region_id,
  year,
  type = "choropleth",
  children,
  ...props
}) {
  const context = {
    metric_id,
    subgroup_id,
    region_id,
    year,
    type,
  };
  // pulls any app specific scale overrides (for choropleth color by category)
  const scaleOverrides = useSpiScaleOverrides(context);
  // get the scale, and pass over the category color overrides
  const { ScaleProps, TickProps } = useChoroplethScale({
    context,
    config: scaleOverrides,
  });
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
