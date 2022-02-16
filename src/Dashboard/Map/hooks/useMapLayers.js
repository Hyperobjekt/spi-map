import useChoroplethLayers from "./useChoroplethLayers";

const GET_VARIABLE_NAME = (context) => {
  return context?.metric_id;
};

/**
 * Returns map layers for the current context for use with mapboxgl.
 * @returns {Array<mapboxgl.Layer>} array of [mapboxgl.Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
 */
export default function useMapLayers(accessor = GET_VARIABLE_NAME) {
  // TODO: bubble layers
  return useChoroplethLayers(accessor);
}
