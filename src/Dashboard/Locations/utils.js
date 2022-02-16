/**
 * Returns the parent identifiers for a given geoid
 * @param {*} geoid
 * @returns
 */
const getLocationContextFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 2) return {};
  return {
    state: getStateFromGeoid(geoid),
    county: getCountyFromGeoid(geoid),
    city: getCityFromGeoid(geoid),
    tract: getTractFromGeoid(geoid),
    bg: getBlockGroupFromGeoid(geoid),
  };
};

/**
 * Returns the state portion of a geoid.
 * @param {*} geoid
 * @returns
 */
const getStateFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 2) return null;
  return geoid.substring(0, 2);
};

/**
 * Returns the county portion for a geoid.
 * @param {*} geoid
 * @returns
 */
const getCountyFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 5) return null;
  return geoid.substring(0, 5);
};

/**
 * Returns the tract portion of a geoid
 * @param {*} geoid
 * @returns
 */
const getTractFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 11) return null;
  return geoid.substring(0, 11);
};

/**
 * Returns the city portion for a geoid.
 * @param {*} geoid
 * @returns
 */
const getCityFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 8) return null;
  return geoid.substring(0, 8);
};

/**
 * Returns the block group portion for a geoid.
 * @param {*} geoid
 * @returns
 */
const getBlockGroupFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 12) return null;
  return geoid.substring(0, 12);
};
