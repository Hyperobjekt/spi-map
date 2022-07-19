import { Scale } from '../components';
import { useMapStore } from '@hyperobjekt/mapgl';
import { Scale as HypScale } from '@hyperobjekt/scales';
import { useChoroplethContext } from '@hyperobjekt/react-dashboard';

/**
 * TODO: combine ChoroplethScale and Scale into single component
 * - Reason: not a logical separation, both are choropleth scales
 */
export default function ChoroplethScale(props) {
  const context = useChoroplethContext();
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const value = hoveredFeature?.properties?.[context?.metric_id];
  return (
    <Scale {...context} {...props}>
      <HypScale.Marker style={{ top: 5.5 }} value={value} color="#f00" pointer />
    </Scale>
  );
}
