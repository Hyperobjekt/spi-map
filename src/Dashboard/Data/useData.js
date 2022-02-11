import { autoType } from "d3-dsv";
import { useConfig, useDataSourceConfig } from "../Config";
import useDataSource from "./useDataSource";

/**
 * Returns react-query result for the data source that matches the provided context.
 * @param {*} context context used to match the data source and interpolate the URL
 * @param {function} parser (optional) function that parses the returned data from the data source
 */
export default function useData(context = {}, parser = autoType) {
  const dataSource = useDataSourceConfig(context);
  return useDataSource(dataSource || {}, { context, parser });
}
