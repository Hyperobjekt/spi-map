import { useConfigStore } from "..";

/**
 * Helper function for retrieving config entries.
 * @param {*} id config entry ID
 */
export default function useConfig(id) {
  return useConfigStore((state) => state[id]);
}
