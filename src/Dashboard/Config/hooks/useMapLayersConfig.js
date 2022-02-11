import { useConfig } from ".";
import { getAllMatches } from "..";

/**
 * Returns the best match in the map layers config for the provided context.
 * @param {object} context context used to match the map layer
 */
export default function useMapLayersConfig(context) {
  const mapLayers = useConfig("mapLayers");
  return getAllMatches(context, mapLayers);
}
