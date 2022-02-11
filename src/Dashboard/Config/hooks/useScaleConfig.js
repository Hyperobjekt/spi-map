import { useConfig } from ".";
import { getBestMatch } from "..";

/**
 * Returns the best match in the scales config for the provided context.
 * @param {object} context context used to match the scales
 */
export default function useScaleConfig(context) {
  const scales = useConfig("scales");
  return getBestMatch(context, scales);
}
