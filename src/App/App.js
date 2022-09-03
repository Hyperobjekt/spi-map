import Dashboard, { QueryParamRouter } from '@hyperobjekt/react-dashboard';
import '@hyperobjekt/mapgl/dist/style.css';
import '@hyperobjekt/scales/dist/style.css';
import { CssBaseline } from '@mui/material';
import { styled, ThemeProvider } from '@mui/system';
import shallow from 'zustand/shallow';
import Header from './components/Header';
import { Map } from './Map';
import { IntroModal } from './IntroModal';
import { EmailAction } from './EmailAction';
import { IndicatorPanel, CustomizeIndicatorPanel, useIndicatorPanelStore } from './IndicatorPanel';
import { SearchModal } from './Search';
import { Scorecards } from './Scorecards';
import theme from '../theme';

const CONFIG = {
  app: '/assets/config/app.json',
  metrics: '/assets/config/metrics.json',
  subgroups: '/assets/config/subgroups.json',
  regions: '/assets/config/regions.json',
  dataSources: '/assets/config/dataSources.json',
  scales: '/assets/config/scales.json',
  mapLayers: '/assets/config/mapLayers.json',
  mapSources: '/assets/config/mapSources.json',
  lang: {
    en: '/assets/en.json',
  },
};

const AppWrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
});

function App() {
  // pull state and setter that determines if the indicator panel is open
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow,
  );

  // tracks if the customize indicators panel is open
  const customizeOpen = useIndicatorPanelStore((state) => state.customizeOpen);

  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  console.log(params);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard config={CONFIG}>
        <QueryParamRouter />
        <AppWrapper className="App">
          <Header />
          <Map>
            {!!params.mode ? <EmailAction {...params} /> : <IntroModal />}
            <IndicatorPanel open={indicatorsOpen} onClose={() => setIndicatorsOpen(false)} />
            <CustomizeIndicatorPanel open={customizeOpen} />
          </Map>
          <Scorecards />
        </AppWrapper>
        <SearchModal />
      </Dashboard>
    </ThemeProvider>
  );
}

export default App;
