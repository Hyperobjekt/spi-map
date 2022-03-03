import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDebounce } from "rooks";
import { useMapStore } from "@hyperobjekt/mapgl";
import shallow from "zustand/shallow";
import useRouteStore from "./store";
import useDashboardStore from "../store";
import { useLocationStore } from "../Locations";
import { setUrlQueryParams } from "./utils";

/**
 * This component pulls state from the various stores in the app and
 * updates the URL query params on changes.
 *
 * NOTE: This component does not render anything. Due to the amount of
 * state it watches, it is isolated to prevent re-renders in other components
 * for performance.
 */
const QueryParamRouter = ({ varMap: varMapOverride, additionalParams }) => {
  // pull the variable map and setter from the router store
  const [varMap, setVarMap] = useRouteStore(
    (state) => [state.varMap, state.setVarMap],
    shallow
  );
  // pull the current dashboard selections from the dashboard store
  const [choroplethMetric, bubbleMetric, subgroup, region, year] =
    useDashboardStore(
      (state) => [
        state.choroplethMetric,
        state.bubbleMetric,
        state.subgroup,
        state.region,
        state.year,
      ],
      shallow
    );
  // pulls the view state from the map store ({zoom, latitude, longitude})
  const viewState = useMapStore((state) => state.viewState);
  // pull the current locations from the map store
  const selected = useLocationStore((state) => state.selected);
  // pulls an object of query params from the store
  const queryParams = useRouteStore((state) => state.queryParams);
  // sets a query params object in the route store
  const setQueryParams = useRouteStore((state) => state.setQueryParams);
  // use a debounced set to prevent flooding route updates
  const setQueryParamsDebounced = useDebounce(setQueryParams, 1000);

  // if a varMap override is provided, update the store
  useEffect(() => {
    varMapOverride &&
      typeof varMapOverride === "object" &&
      setVarMap(varMapOverride);
  }, [varMapOverride, setVarMap]);

  // when state changes, update the query params store (debounced)
  useEffect(() => {
    const locations = selected.map((f) => f.properties.GEOID).join("-");
    const { zoom, latitude, longitude } = viewState;
    // create object with all route param values
    const params = {
      choroplethMetric,
      bubbleMetric,
      subgroup,
      region,
      year,
      zoom: zoom?.toFixed(2),
      latitude: latitude?.toFixed(2),
      longitude: longitude?.toFixed(2),
      locations,
      ...additionalParams,
    };
    // map all of the parameter values to names in the var map
    const mappedParams = Object.keys(params).reduce((acc, key) => {
      const value = params[key];
      // only add the param if it has a value
      if (value) {
        acc[varMap[key] || key] = value;
      }
      return acc;
    }, {});
    setQueryParamsDebounced(mappedParams);
  }, [
    choroplethMetric,
    bubbleMetric,
    subgroup,
    region,
    year,
    viewState,
    additionalParams,
    setQueryParamsDebounced,
    varMap,
    selected,
  ]);

  // when query params change, update the URL
  useEffect(() => {
    setUrlQueryParams(queryParams);
  }, [queryParams]);

  // render nothing!
  return null;
};

QueryParamRouter.defaultProps = {
  additionalParams: {},
};

QueryParamRouter.propTypes = {
  /** (optional) an object that maps state values to route param names */
  varMap: PropTypes.object,
  /** (optional) any additional values to add to the route */
  additionalParams: PropTypes.object,
};

export default QueryParamRouter;
