import { useChoroplethContext, useDashboardStore } from '@hyperobjekt/react-dashboard';
import useChoroplethLayerContext from './useChoroplethLayerContext';
import useSpiScaleOverrides from '../../hooks/useSpiScaleOverrides';
import { createCircleLayers, getChoroplethLayers } from '../utils';
import useAppStore from 'App/store';

/**
 * Returns map layers for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useSpiMapLayers() {
  // pull the current context based on user selections
  const currentContext = useChoroplethContext();
  // pull scale overrides for the current context (for category colors)
  const scaleOverrides = useSpiScaleOverrides(currentContext);
  // pull if auto-switch is on or off
  const autoSwitchRegion = useDashboardStore((state) => state.autoSwitchRegion);
  const role = useAppStore((state) => state.role);
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
  // create separate context for circles (uses context for whichever region is active)
  const circleContext = useChoroplethLayerContext({ scale: scaleOverrides });
  /// if no autoswitch, then only return the layers for the current region
  if (!autoSwitchRegion) {
    return getChoroplethLayers(layerContexts[currentContext.region_id]);
  }

  // if autoswitch is on, then return all layers
  const allLayers = Object.keys(layerContexts)
    .filter((region) => {
      if (role === 'Basic') return region === 'states';
      return role === 'Premium Plus' ? region : region !== 'tracts';
    })
    .map((region) => {
      return getChoroplethLayers(layerContexts[region]);
    })
    .flat()
    // ensure only the current choropleth region is interactive
    .map((layer) => {
      if (!layer.interactive) return layer;
      if (layer.interactive && layer['source-layer'] === currentContext.region_id) return layer;
      return {
        ...layer,
        interactive: false,
      };
    });
  /** Circle layers for cities */
  const circleLayers = createCircleLayers(circleContext);
  return [...allLayers, ...circleLayers];
}
