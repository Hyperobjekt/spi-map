import { useMapState } from '@hyperobjekt/mapgl';
import { useConfig, useDashboardStore } from '@hyperobjekt/react-dashboard';
import { usePreviousProps } from '@mui/utils';
import { useEffect } from 'react';

/**
 * Given an array of region configs, and a zoom level, returns an array of
 * region configs that are in the zoom range.
 * @param {object} regionsConfig
 * @param {number} zoom
 * @returns {Array<RegionConfig>}
 */
const getRegionsInZoomRange = (regionsConfig, zoom) => {
  const regions = [];
  for (const region of regionsConfig) {
    if (region.min_zoom <= zoom && region.max_zoom >= zoom) {
      regions.push(region);
    }
  }
  return regions;
};

/**
 * Returns the next region to switch to, based on the zoom direction and
 * regions provided.  Returns the region with the lowest max zoom if zooming in,
 * and the highest max zoom if zooming out.
 * @param {*} regionsConfig
 * @param {*} isZoomingIn
 * @returns
 */
const getSwitchRegion = (regionsConfig, isZoomingIn) => {
  if (!regionsConfig?.length || !Array.isArray(regionsConfig)) return null;
  // if zooming in, switch to the region lowest max zoom
  if (isZoomingIn)
    return regionsConfig.reduce((prev, curr) =>
      prev['max_zoom'] < curr['max_zoom'] ? prev : curr,
    );
  // if zooming out, switch to the region highest max zoom
  return regionsConfig.reduce((prev, curr) => (prev['max_zoom'] > curr['max_zoom'] ? prev : curr));
};

/**
 * When this component is used, the map will automatically switch regions
 * as the user zooms in and out, based on the regions config.
 *
 * IMPORTANT: THIS COMPONENT DOES NOT RENDER ANYTHING
 * The state changes frequently because of zoom actions, so this code is
 * isolated to an empty component so it doesn't trigger re-renders on
 * other components.
 */
const MapAutoSwitch = () => {
  // pull region config and state
  const regionsConfig = useConfig('regions');
  const currentRegion = useDashboardStore((state) => state.region);
  const setRegion = useDashboardStore((state) => state.setRegion);

  // get zoom state of the map, and track previous to know zoom direction
  const viewState = useMapState('viewState');
  const previousViewState = usePreviousProps(viewState);
  const zoom = viewState.zoom;
  const previousZoom = previousViewState?.zoom;
  const isZoomingIn = zoom > previousZoom;

  // get regions in the zoom range, and determine if we need to switch
  const regionsInZoomRange = getRegionsInZoomRange(regionsConfig, zoom);
  const shouldSwitch = !regionsInZoomRange.some(
    (regionConfig) => regionConfig.id === currentRegion,
  );

  // get the next region, based on the zoom direction and regions in range
  const nextRegion = getSwitchRegion(regionsInZoomRange, isZoomingIn);
  const nextRegionId = nextRegion?.id;
  useEffect(() => {
    shouldSwitch && nextRegionId && setRegion(nextRegionId);
  }, [nextRegionId, shouldSwitch, setRegion]);

  // render nothing!
  return null;
};

MapAutoSwitch.propTypes = {};

export default MapAutoSwitch;
