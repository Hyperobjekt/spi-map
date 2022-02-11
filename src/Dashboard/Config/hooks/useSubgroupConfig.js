import { useMemo } from "react";
import { useConfigStore } from "..";

/**
 * Returns all subgroups config, or an individual subgroup config if ID is provided
 * @param {string} id (optional) subgroup ID
 * @returns {Array|object} array of subgroup configs or single subgroup config
 */
export default function useSubgroupConfig(id) {
  const subgroups = useConfigStore((state) => state.subgroups);
  return useMemo(() => {
    if (!id) return subgroups;
    return subgroups.find((r) => r.id === id);
  }, [id, subgroups]);
}
