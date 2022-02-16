import { getColorInterpolator, getPositionScale } from "@hyperobjekt/scales";
import union from "@turf/union";

/**
 * Returns an array of from / to values with the given number of steps between.
 * (e.g. for mapping values to bubble radius)
 */
export const getLinearRamp = (from, to, steps = 1) => {
  // adjust from extent if values are equal
  if (from && from[0] === from[1]) from = [0, from[1]];
  if (from[0] === from[1]) from = [0, 1];
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = getPositionScale("linear", [0, 1], to);
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

/**
 * Returns an array of position / color pairs to use for continuous
 * color gradients.
 * (e.g. for mapping values to colors)
 */
export const getLinearColorRamp = (from, to, steps = 1) => {
  if (!from || !from[0] || !from[1]) from = [0, 1];
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = to;
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

/**
 * Takes the color "chunks" for the given color scale and returns
 * a color / value pair for each to use for fill styles.
 * @param {*} chunks
 * @returns
 */
export const getStepsFromChunks = (chunks) => {
  const steps = [];
  chunks.forEach((chunk, i) => {
    if (i === 0) steps.push(chunk.color);
    steps.push(chunk.value[0]);
    steps.push(chunk.color);
  });
  return steps;
};

export const combineFeatures = (features) => {
  return features.length > 0
    ? features.reduce(
        (combined, f) =>
          combined ? union(combined, f, { properties: f.properties }) : f,
        null
      )
    : features;
};
