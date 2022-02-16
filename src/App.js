import { useConfigStore, useLoadConfig } from "./Dashboard/Config";
import Debug from "./Dashboard/components/Debug";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AllScales from "./Dashboard/components/AllScales";
import { Map } from "./Dashboard/Map";
import "@hyperobjekt/mapgl/dist/style.css";
import "@hyperobjekt/scales/dist/style.css";
import { useLocationLoader } from "./Dashboard/Locations";
import ChoroplethSelect from "./Dashboard/components/ChoroplethSelect";
import { ChoroplethScale } from "./Dashboard/components";
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
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 99,
              background: "#fff",
              padding: 16,
              border: `1px solid #ccc`,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <ChoroplethSelect />
            <ChoroplethScale />
          </div>
          <Map />
        </div>
        <Debug options={DEBUG} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
