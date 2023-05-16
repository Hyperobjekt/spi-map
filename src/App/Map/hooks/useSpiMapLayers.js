import { useChoroplethContext } from '@hyperobjekt/react-dashboard';
import useChoroplethLayerContext from './useChoroplethLayerContext';
import useSpiScaleOverrides from '../../hooks/useSpiScaleOverrides';
import { getChoroplethLayers } from '../utils';

/**
 * Returns map layers for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useSpiMapLayers() {
  // pull the current context based on user selections
  const currentContext = useChoroplethContext();
  // pull scale overrides for the current context (for category colors)
  const scaleOverrides = useSpiScaleOverrides(currentContext);
  // create layers contexts for all available regions
  // each region has its own scale extents
  const layerContexts = {
    states: useChoroplethLayerContext({
      context: {
        region_id: 'states',
        isActiveRegion: currentContext.region_id === 'states',
      },
      scale: scaleOverrides,
    }),
    cities: useChoroplethLayerContext({
      context: {
        region_id: 'cities',
        isActiveRegion: currentContext.region_id === 'cities',
      },
      scale: scaleOverrides,
    }),
    tracts: useChoroplethLayerContext({
      context: {
        region_id: 'tracts',
        isActiveRegion: currentContext.region_id === 'tracts',
      },
      scale: scaleOverrides,
    }),
  };

  return getChoroplethLayers(layerContexts[currentContext.region_id]);
}
