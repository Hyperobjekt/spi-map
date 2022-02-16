import { useConfigStore, useLoadConfig } from "./Dashboard/Config";
import Debug from "./Dashboard/components/Debug";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AllScales from "./Dashboard/components/AllScales";
import { Map } from "./Dashboard/Map";

const DEBUG = ["context", "mapSources", "metrics"];

const CONFIG = {
  app: "/assets/config/app.json",
  metrics: "/assets/config/metrics.json",
  subgroups: "/assets/config/subgroups.json",
  regions: "/assets/config/regions.json",
  dataSources: "/assets/config/dataSources.json",
  scales: "/assets/config/scales.json",
  mapLayers: "/assets/config/mapLayers.json",
  lang: {
    en: "/assets/en.json",
  },
};

function App({ config = CONFIG }) {
  useLoadConfig(config);
  const isReady = useConfigStore((state) => state.ready);
  const queryClient = new QueryClient();
  if (!isReady) return <div>Loading...</div>;
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        {/* <AllScales /> */}
        <Map />
        <Debug options={DEBUG} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
