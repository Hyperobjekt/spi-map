/**
 * Returns the region type based on the GEOID
 * @param {string} geoid
 * @returns {string} "states", "counties", "cities", "tracts", "bg"
 */
export const getRegionFromGeoid = (geoid) => {
  switch (geoid.length) {
    case 2:
      return "states";
    case 5:
      return "counties";
    case 11:
      return "tracts";
    case 7:
      return "cities";
    case 12:
      return "bg";
    default:
      throw new Error("Could not determine region type from geoid");
  }
};

/**
 * Returns the parent identifiers for a given geoid
 * @param {*} geoid
 * @returns
 */
export const getLocationContextFromGeoid = (geoid) => {
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
export const getStateFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 2) return null;
  return geoid.substring(0, 2);
};

/**
 * Returns the county portion for a geoid.
 * @param {*} geoid
 * @returns
 */
export const getCountyFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 5) return null;
  return geoid.substring(0, 5);
};

/**
 * Returns the tract portion of a geoid
 * @param {*} geoid
 * @returns
 */
export const getTractFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 11) return null;
  return geoid.substring(0, 11);
};

/**
 * Returns the city portion for a geoid.
 * @param {*} geoid
 * @returns
 */
export const getCityFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 8) return null;
  return geoid.substring(0, 7);
};

/**
 * Returns the block group portion for a geoid.
 * @param {*} geoid
 * @returns
 */
export const getBlockGroupFromGeoid = (geoid) => {
  if (typeof geoid !== "string" || geoid.length < 12) return null;
  return geoid.substring(0, 12);
};
