import { autoType } from "d3-dsv";
import { getFormatter } from "../Formatters";
import { parseId, parseValues, parseValue, PASS_THROUGH } from "../Parsers";

// Default parsers for all available types of config
const DEFAULT_PARSERS = {
  app: (row) => {
    switch (row.id) {
      case "year":
      case "default_year":
        return {
          id: row.id,
          value: parseValues(row.value, { type: "string" }),
        };
      case "default_viewport":
        return { id: row.id, value: parseValues(row.value, { type: "float" }) };
      default:
        return { id: row.id, value: parseValues(row.value) };
    }
  },
  regions: autoType,
  metrics: (row) => {
    return {
      id: row.id,
      name: row.name, // TODO: pull from language store
      description: row.description, // TODO: pull from language store
      source: row.source,
      link: row.link,
      category: parseValues(row.category),
      subcategory: parseValues(row.subcategory),
      formatter: getFormatter(row.format),
      exclude_regions: parseValues(row.exclude_regions),
    };
  },
  subgroups: autoType,
  data_sources: (row) => {
    return {
      id: row.id,
      region_id: parseValues(row.region_id),
      metric_id: parseValues(row.metric_id),
      subgroup_id: parseValues(row.subgroup_id),
      year: parseValues(row.year, { type: "string" }),
      url: row.url,
      _meta: {
        originalId: row.id,
        idParts: row.id.split("_"),
        idStructure: ["region_id", "metric_id", "subgroup_id", "year"],
      },
    };
  },
  map_layers: (row) => {
    return {
      id: parseId(row.id),
      region_id: parseValues(row.region_id),
      metric_id: parseValues(row.metric_id),
      subgroup_id: parseValues(row.subgroup_id),
      year: parseValues(row.year, { type: "string" }),
      type: row.type,
      source: row.source,
      source_type: row.source_type,
      source_layer: row.source_layer,
      _meta: {
        originalId: row.id,
        idParts: row.id.split("_"),
        idStructure: ["region_id", "type", "year"],
      },
    };
  },
  metric_scales: (row) => {
    return {
      id: parseId(row.id),
      region_id: parseValues(row.region_id),
      metric_id: parseValues(row.metric_id),
      subgroup_id: parseValues(row.subgroup_id),
      year: parseValues(row.year, { type: "string" }),
      scale: row.scale,
      chunks: parseValues(row.chunks),
      min_quantile: parseValue(row.min_quantile),
      max_quantile: parseValue(row.max_quantile),
      min_extent: parseValue(row.min_extent),
      max_extent: parseValue(row.max_extent),
      colors: parseValues(row.colors),
      _meta: {
        originalId: row.id,
        idParts: row.id.split("_"),
        idStructure: ["region_id", "metric_id", "subgroup_id", "year"],
      },
    };
  },
};

/**
 * Returns a parser for the given config type (if any).
 * @param {*} configType
 * @returns
 */
export const getDefaultParser = (configType) => {
  if (!DEFAULT_PARSERS[configType]) {
    console.debug(
      `no parser provided for config, so config will not be parsed. (fine when using JSON config)`
    );
    return PASS_THROUGH; // return whatever data is passed
  }
  return DEFAULT_PARSERS[configType];
};
