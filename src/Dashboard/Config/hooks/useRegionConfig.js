import { useMemo } from "react";
import { useConfigStore } from "..";

/**
 * Returns all regions config, or an individual region config if ID is provided
 * @param {string} id (optional) region ID
 * @returns {Array|object} array of region configs or single region config
 */
export default function useRegionConfig(id) {
  const regions = useConfigStore((state) => state.regions);
  return useMemo(() => {
    if (!id) return regions;
    return regions.find((r) => r.id === id);
  }, [id, regions]);
}
