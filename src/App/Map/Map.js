import { Button } from '@mui/material';
import React from 'react';
import shallow from 'zustand/shallow';
import MapWrapper from './components/MapWrapper';
import MapGL from './components/MapGL';
import { Legend } from '../Legend';
import MapTooltip from './components/MapTooltip';
import { useIndicatorPanelStore } from '../IndicatorPanel';

export default function Map({ children, ...props }) {
  // pull state and setter that determines if the indicator panel is open
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow,
  );

  return (
    <MapWrapper {...props}>
      <MapGL>
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
      </MapGL>
      {children}
      <MapTooltip />
    </MapWrapper>
  );
}
