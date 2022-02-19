import { useConfigStore, useLoadConfig } from "./Dashboard/Config";
import Debug from "./Demo/components/Debug";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Map from "./Demo/components/Map";
import "@hyperobjekt/mapgl/dist/style.css";
import "@hyperobjekt/scales/dist/style.css";
import { Legend } from "./Demo/components/Legend";
import { Button, CssBaseline } from "@mui/material";
import { styled, ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import Header from "./Demo/components/Header";
import Panel from "./Demo/components/Panel";
import { useState } from "react";
import useCategorizedMetrics from "./Dashboard/Config/hooks/useCategorizedMetrics";
import MetricsList from "./Demo/components/MetricsList";
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#0D7682",
    },
    secondary: {
      main: "#DB8741",
    },
    background: {
      dark: "#142324",
    },
  },
  typography: {
    fontFamily: "proxima-nova, sans-serif",
    fontWeightBold: 600,
    fontWeightRegular: 400,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: "24px",
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#142324",
          fontSize: "0.75rem",
        },
        arrow: {
          color: "#142324",
        },
      },
    },
  },
});

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

function App({ config = CONFIG }) {
  const [indicatorsOpen, setIndicatorsOpen] = useState(true);
  console.log({ theme });
  useLoadConfig(config);
  const isReady = useConfigStore((state) => state.ready);
  const queryClient = new QueryClient();
  if (!isReady) return <div>Loading...</div>;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppWrapper className="App">
          <Header />
          <MapBodyWrapper>
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
            <Panel
              position="right"
              title="Social Progress Indicators"
              open={indicatorsOpen}
              onClose={() => setIndicatorsOpen(false)}
            >
              <MetricsList />
            </Panel>
          </MapBodyWrapper>
        </AppWrapper>
        {/* <AllScales /> */}
        <Debug options={DEBUG} />
        <ReactQueryDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
