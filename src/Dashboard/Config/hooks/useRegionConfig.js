import { useMemo } from "react";
import { useConfigStore } from "..";
import { useLangObject } from "../../i18n";

/**
 * Returns all regions config, or an individual region config if ID is provided
 * @param {string} id (optional) region ID
 * @returns {Array|object} array of region configs or single region config
 */
export default function useRegionConfig(id) {
  const regions = useConfigStore((state) => state.regions);
  const regionNames = useLangObject(
    regions.map((r) => r.id),
    { prefix: "REGION_" }
  );
  return useMemo(() => {
    const regionsWithLang = regions.map((r) => {
      return {
        ...r,
        name: regionNames[r.id],
      };
    });
    if (!id) return regionsWithLang;
    return regionsWithLang.find((r) => r.id === id);
  }, [id, regions, regionNames]);
}
