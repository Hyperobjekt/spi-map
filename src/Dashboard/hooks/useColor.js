import { useAppConfig } from "../Config";

// maps color types to app config keys
export const CONFIG_KEY_MAP = {
  choropleth: "default_choropleth_colors",
  bubble: "default_bubble_colors",
  unavailable: "unavailable_color",
  location: "location_colors",
};

/**
 * Returns colors for the given type
 * @param {string} type - "choropleth", "bubble", "unavailable", "location"
 * @returns
 */
export default function useColors(type) {
  if (!type || !CONFIG_KEY_MAP[type])
    throw new Error("no color config for type: " + type);
  return useAppConfig(CONFIG_KEY_MAP[type]);
}
