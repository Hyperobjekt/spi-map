import { useCallback } from "react";
import { useLocationStore } from "..";
import { useAppConfig } from "../../Config";

/**
 * Returns true if features have the same GEOID
 * @param {*} a
 * @param {*} b
 * @returns
 */
const areEqual = (a, b) => a.properties.GEOID === b.properties.GEOID;

/**
 *
 * @param {*} usedColors
 * @param {*} availableColors
 * @returns
 */
const getNextColor = (usedColors, availableColors) => {
  // find and unused color and return if it exists
  const nextUnusedColor = availableColors.find((c) => !usedColors.includes(c));
  if (nextUnusedColor) return nextUnusedColor;
  // all colors are used, loop around to the next color after the last used color
  const lastColor = usedColors[usedColors.length - 1];
  const colorIndex = availableColors.indexOf(lastColor);
  const nextColorIndex = (colorIndex + 1) % availableColors.length;
  return availableColors[nextColorIndex];
};

/**
 * Returns a callback function that accepts a feature and adds it to the
 * selected locations list with a color.  If the feature is already selected,
 * it will be removed from the list.
 * @returns {function}
 */
export default function useToggleSelectedLocation() {
  const locationColors = useAppConfig("location_colors");
  const selected = useLocationStore((state) => state.selected);
  const addSelected = useLocationStore((state) => state.addSelected);
  const removeSelected = useLocationStore((state) => state.removeSelected);
  return useCallback(
    (feature) => {
      if (!feature?.properties) return;
      const alreadyExists = selected.some((f) => areEqual(f, feature));
      if (alreadyExists) return removeSelected(feature);
      const selectedColors = selected.map((f) => f.properties.color);
      const color = getNextColor(selectedColors, locationColors);
      addSelected({ ...feature, properties: { ...feature.properties, color } });
    },
    [selected, locationColors, addSelected, removeSelected]
  );
}
