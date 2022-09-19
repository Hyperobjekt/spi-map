import { Button } from '@mui/material';
import React from 'react';
import shallow from 'zustand/shallow';
import MapWrapper from './components/MapWrapper';
import MapGL from './components/MapGL';
import MapTooltip from './components/MapTooltip';
import MoreControls from './components/MoreControls';
import { Legend } from '../Legend';
import { useIndicatorPanelStore } from '../IndicatorPanel';
import { useAuthUser } from 'App/firebase';

export default function Map({ children, ...props }) {
  // pull state and setter that determines if the indicator panel is open
  const [indicatorsOpen, setIndicatorsOpen] = useIndicatorPanelStore(
    (state) => [state.open, state.setOpen],
    shallow,
  );

  const { data: user, isLoading } = useAuthUser();

  if (isLoading || !user?.accessToken) return false;

  return (
    <MapWrapper {...props}>
      <MapGL
        transformRequest={(url, resourceType) => {
          if (resourceType === 'Tile' && url.match('firebasestorage.googleapis.com/')) {
            return {
              url,
              headers: {
                Authorization: 'Bearer ' + user?.accessToken,
              },
            };
          }
        }}
      >
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
        <MoreControls />
      </MapGL>
      {children}
      <MapTooltip />
    </MapWrapper>
  );
}
