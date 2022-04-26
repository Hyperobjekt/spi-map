import "@hyperobjekt/mapgl/dist/style.css";
import "@hyperobjekt/scales/dist/style.css";
import { CssBaseline } from "@mui/material";
import { styled, ThemeProvider } from "@mui/system";
import Header from "./components/Header";
import { IndicatorPanel } from "./IndicatorPanel/IndicatorPanel";
import useIndicatorPanelStore from "./IndicatorPanel/store";
import shallow from "zustand/shallow";
import { Map } from "./Map";
import CustomizeIndiactorPanel from "./IndicatorPanel/CustomizeIndicatorPanel";
import Dashboard, { QueryParamRouter } from "@hyperobjekt/react-dashboard";
import { Scorecards } from "./Scorecards";
import theme from "../theme";
import SearchModal from "./Search/components/SearchModal";

const CONFIG = {
  app: "/assets/config/app.json",
  metrics: "/assets/config/metrics.json",
  subgroups: "/assets/config/subgroups.json",
  regions: "/assets/config/regions.json",
  dataSources: "/assets/config/dataSources.json",
  scales: "/assets/config/scales.json",
  mapLayers: "/assets/config/mapLayers.json",
  mapSources: "/assets/config/mapSources.json",
  lang: {
    en: "/assets/en.json",
  },
};

const AppWrapper = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
});

function App() {
  // pull state and setter that determines if the indicator panel is open
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow
  );
  // tracks if the customize indicators panel is open
  const customizeOpen = useIndicatorPanelStore((state) => state.customizeOpen);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard config={CONFIG}>
        <QueryParamRouter />
        <AppWrapper className="App">
          <Header />
          <Map>
            <IndicatorPanel
              open={indicatorsOpen}
              onClose={() => setIndicatorsOpen(false)}
            />
            <CustomizeIndiactorPanel open={customizeOpen} />
          </Map>
          <Scorecards />
        </AppWrapper>
        <SearchModal />
      </Dashboard>
    </ThemeProvider>
  );
}

export default App;
