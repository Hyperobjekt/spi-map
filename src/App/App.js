import "@hyperobjekt/mapgl/dist/style.css";
import "@hyperobjekt/scales/dist/style.css";
import { Legend } from "./Legend/Legend";
import { Button, CssBaseline } from "@mui/material";
import { styled, ThemeProvider } from "@mui/system";
import Header from "./components/Header";

import { IndicatorPanel } from "./IndicatorPanel/IndicatorPanel";
import useIndicatorPanelStore from "./IndicatorPanel/store";
import shallow from "zustand/shallow";
import { useCallback } from "react";
import { MapTooltip, Map } from "./Map";
import CustomizeIndiactorPanel from "./IndicatorPanel/CustomizeIndicatorPanel";
import Dashboard, { useDashboardStore } from "@hyperobjekt/react-dashboard";
import { Scorecards } from "./Scorecards";
import theme from "../theme";
// // debug tools
// import Debug from "./Demo/components/Debug";
// import { ReactQueryDevtools } from "react-query/devtools";
// const DEBUG = ["context", "mapSources", "metrics"];

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

const AppWrapper = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "stretch",
  width: "100%",
  minHeight: "100vh",
});

const MapBodyWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  height: `calc(100vh - ${theme.spacing(7)})`,
  maxHeight: `calc(100vh - ${theme.spacing(7)})`,
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    height: `calc(100vh - ${theme.spacing(8)})`,
    maxHeight: `calc(100vh - ${theme.spacing(8)})`,
  },
  "& .HypMapGl-root": {
    position: "absolute",
    inset: 0,
    height: "100%",
  },
}));

function App() {
  // pull state and setter that determines if the indicator panel is open
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow
  );
  // tracks if the customize indicators panel is open
  const customizeOpen = useIndicatorPanelStore((state) => state.customizeOpen);
  // track mouse coords for tooltip
  const setHoverCoords = useDashboardStore((state) => state.setHoverCoords);
  // update the mouse coords as the mouse moves
  const handleMouseMove = useCallback(
    (event) => {
      setHoverCoords([event.pageX, event.pageY]);
    },
    [setHoverCoords]
  );
  return (
    <ThemeProvider theme={theme}>
      <Dashboard config={CONFIG}>
        <CssBaseline />
        <AppWrapper className="App">
          <Header />
          <MapBodyWrapper onMouseMove={handleMouseMove}>
            <Map>
              <Legend square>
                {!indicatorsOpen && (
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => setIndicatorsOpen(!indicatorsOpen)}
                  >
                    Show all indicators
                  </Button>
                )}
              </Legend>
            </Map>
            <IndicatorPanel
              open={indicatorsOpen}
              onClose={() => setIndicatorsOpen(false)}
            />
            <CustomizeIndiactorPanel open={customizeOpen} />
            <MapTooltip />
          </MapBodyWrapper>
          <Scorecards />
        </AppWrapper>
      </Dashboard>
    </ThemeProvider>
  );
}

export default App;
