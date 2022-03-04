import { useLoadConfig } from "./Config";
import { QueryClient, QueryClientProvider } from "react-query";
import QueryParamRouter from "./Router/QueryParamRouter";
import { getDefaultsFromConfig } from "./utils";
import useCurrentRouteParams from "./Router/useCurrentRouteParams";
import { useConfigStore } from "./Config";
import useDashboardStore from "./store";
import { useDidMount } from "rooks";
import { useMapStore } from "@hyperobjekt/mapgl";
import { Loader } from "./components";

/**
 * Dashboard wrapper component that handles setting up the query provider
 * as well as loading the configuration and setting the initial state for the
 * dashboard.
 */
export default function Dashboard({
  client,
  config,
  loader,
  children,
  ...props
}) {
  // use the async config loader function
  const loadConfig = useLoadConfig();
  // generic setter for the dashboard store
  const setValues = useDashboardStore((state) => state.set);
  // pulls the query params from the url
  const routeValues = useCurrentRouteParams();
  // setter for map viewport (zoom, lat, lon)
  const setViewState = useMapStore((state) => state.setViewState);
  // config ready state
  const isReady = useConfigStore((state) => state.ready);
  const setReady = useConfigStore((state) => state.setReady);

  // load configuration and set default values on mount
  useDidMount(() => {
    loadConfig(config).then((loadedConfig) => {
      const defaultValues = getDefaultsFromConfig(loadedConfig);
      // merge defaults and route options
      const loadedValues = { ...defaultValues, ...routeValues };
      // extract non-dashboard state from the values
      const { zoom, latitude, longitude, locations, ...dashboardState } =
        loadedValues;
      // set the selections for the dashboard
      setValues(dashboardState);
      // set the viewport state for the map if values exist
      zoom &&
        latitude &&
        longitude &&
        setViewState({
          zoom: Number(zoom),
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
      // 💅 config has loaded, defaults set, the dashboard is ready
      setReady(true);
    });
  });

  return (
    <QueryClientProvider client={client} {...props}>
      {isReady ? (
        <>
          {/*
              We only want to connect the router once 
              the config + route selections have loaded
           */}
          <QueryParamRouter />
          {children}
        </>
      ) : (
        loader
      )}
    </QueryClientProvider>
  );
}

Dashboard.defaultProps = {
  client: new QueryClient(),
  loader: <Loader />,
};
