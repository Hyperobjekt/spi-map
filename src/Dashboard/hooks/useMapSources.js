import { useMapLayersConfig } from "../Config";
import useCurrentContext from "./useCurrentContext";

/**
 * Returns map sources for the current context for use with mapboxgl.
 * @returns {object} object containing [map sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources)
 */
export default function useMapSources() {
  const { choroplethMetric, bubbleMetric, subgroup, region, year } =
    useCurrentContext();
  const choroplethLayers = useMapLayersConfig({
    metric_id: choroplethMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "choropleth",
  });
  const bubbleLayers = useMapLayersConfig({
    metric_id: bubbleMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "bubble",
  });
  // tracks source URLs that have been added to avoid duplicates
  const sourceIndex = [];
  // reduce all layers into a single source object
  return [...choroplethLayers, ...bubbleLayers].reduce(
    (sources, layerConfig) => {
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
    },
    []
  );
}
