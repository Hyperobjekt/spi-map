import useRouteStore from "./store";
import { getCurrentUrlQueryParams } from "./utils";

/**
 * Returns an object of route params
 * @returns
 */
export default function useCurrentRouteParams() {
  const params = getCurrentUrlQueryParams();
  const varMap = useRouteStore((state) => state.varMap);
  return Object.keys(varMap).reduce((acc, key) => {
    if (params[varMap[key]]) acc[key] = params[varMap[key]];
    return acc;
  }, {});
}
