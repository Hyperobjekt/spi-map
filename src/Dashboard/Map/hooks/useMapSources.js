import { useMemo } from "react";
import { useBubbleLayerConfig, useChoroplethLayerConfig } from "../../hooks";

/**
 * Maps an array of layer configs to an array of mapboxgl sources, removing any duplicates.
 * @param {Array<MapLayerConfig>} layerConfigs
 * @returns
 */
const getSourcesFromLayerConfigs = (layerConfigs) => {
  const sourceIndex = [];
  return layerConfigs.reduce((sources, layerConfig) => {
    if (sourceIndex.indexOf(layerConfig.source) > -1) return sources;
    const id = layerConfig.source_id || layerConfig.id;
    const url = layerConfig.source_url;
    // create the source object based on source type
    switch (layerConfig.source_type) {
      case "geojson":
        sources.push({ id, type: "geojson", data: url });
        sourceIndex.push(url);
        return sources;
      case "vector_url":
        sources.push({ id, type: "vector", url });
        sourceIndex.push(url);
        return sources;
      case "vector_tiles":
        sources.push({ id, type: "vector", tiles: [url] });
        sourceIndex.push(url);
        return sources;
      default:
        console.warn(`invalid source type for layer ${layerConfig.id}`);
        return sources;
    }
  }, []);
};

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {Array<mapboxgl.Source>} array of [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useMapSources() {
  const choroplethLayers = useChoroplethLayerConfig();
  const bubbleLayers = useBubbleLayerConfig();
  return useMemo(() => {
    return getSourcesFromLayerConfigs([...choroplethLayers, ...bubbleLayers]);
  }, [choroplethLayers, bubbleLayers]);
}
