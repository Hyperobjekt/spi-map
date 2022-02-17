import { useConfigStore, useLoadConfig } from "./Dashboard/Config";
import Debug from "./Demo/components/Debug";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AllScales from "./Demo/components/AllScales";
import Map from "./Demo/components/Map";
import "@hyperobjekt/mapgl/dist/style.css";
import "@hyperobjekt/scales/dist/style.css";
import ChoroplethSelect from "./Demo/components/ChoroplethSelect";
import { ChoroplethScale } from "./Demo/components";
import { Legend } from "./Demo/components/Legend";
import { CssBaseline } from "@mui/material";
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
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          <Legend />
          <Map />
        </div>
        <AllScales />
        <Debug options={DEBUG} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
