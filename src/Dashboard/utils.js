/**
 * Pulls default selections from app config
 * @param {*} config
 * @returns
 */
export const getDefaultsFromConfig = (config) => {
  const values = {};
  const appConfig = config.app;
  values["year"] = appConfig.default_year || appConfig.years?.[0];
  values["region"] = appConfig.default_region || config.regions?.[0]?.id;
  values["subgroup"] = appConfig.default_subgroup || config.subgroups?.[0]?.id;
  values["choroplethMetric"] = appConfig.default_choropleth_metric;
  values["bubbleMetric"] = appConfig.default_bubble_metric;
  return values;
};
