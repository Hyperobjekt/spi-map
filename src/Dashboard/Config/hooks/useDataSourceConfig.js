import { useConfig } from ".";
import { getBestMatch } from "..";

/**
 * Returns the best match in the data source config for the provided context.
 * @param {object} context context used to match the data source
 */
export default function useDataSourceConfig(context) {
  const isReady = useConfig("ready");
  const dataSources = useConfig("dataSources");
  console.debug(context, dataSources, getBestMatch(context, dataSources));
  return getBestMatch(context, dataSources);
}
