import { ExpandLess, ExpandMore, HelpOutline } from '@mui/icons-material';
import {
  Alert,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useEffect } from 'react';
import {
  useChoroplethContext,
  useMetricConfig,
  useRegionConfig,
  useLocationStore,
  useLocationFeature,
} from '@hyperobjekt/react-dashboard';
import { LocationListItem } from '../Location';
import { getLocationNameParts } from '../utils';
import ChoroplethScale from './ChoroplethScale';
import ChoroplethSelect from './ChoroplethSelect';
import RegionSelect from './RegionSelect';
import { useMapStore } from '@hyperobjekt/mapgl';
import useActiveView from '../hooks/useActiveView';

const LegendContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: 24,
  right: 24,
  zIndex: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 2, 1, 2),
  maxWidth: 300,
}));

const HelpContainer = styled(Paper)(({ theme }) => {
  return {
    position: 'absolute',
    right: '-16px',
    padding: '4px 4px 4px 0px',
    borderRadius: '0 24px 24px 0',
    top: 10,
    '&:before': {
      content: '""',
      position: 'absolute',
      background: theme.palette.background.paper,
      left: -2,
      height: 40,
      width: 14,
      top: -2,
      zIndex: 2,
    },
    '& svg': {
      display: 'block',
      position: 'relative',
      zIndex: 4,
      color: theme.palette.grey['500'],
    },
  };
});

export const Legend = ({ children, ...props }) => {
  const { metric_id, region_id } = useChoroplethContext();
  const regionConfig = useRegionConfig(region_id);
  const metric = useMetricConfig(metric_id);
  const selected = useLocationFeature(5);
  const removeSelected = useLocationStore((state) => state.removeSelected);
  const flyToFeature = useMapStore((state) => state.flyToFeature);
  const listRef = React.useRef();
  const [expanded, setExpanded] = React.useState(true);

  const regionHasMetric = regionConfig?.metrics?.includes(metric_id);
  const [, setActiveView] = useActiveView();

  // scroll to the bottom of the list when adding new items
  useEffect(() => {
    if (selected.length > 5 && listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [selected.length]);

  const handleShowFullData = () => {
    setActiveView('scorecard');
  };

  return (
    <LegendContainer {...props}>
      <Snackbar open={!regionHasMetric} autoHideDuration={6000}>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          {metric.name} is unavailable for {regionConfig.name}
        </Alert>
      </Snackbar>
      {metric.hint && (
        <HelpContainer>
          <Tooltip title={metric.hint} placement="left" arrow>
            <HelpOutline />
          </Tooltip>
        </HelpContainer>
      )}
      <ChoroplethSelect />
      <Box display="flex" alignItems="center" gap={0.5} mt={0.5} mb={1}>
        <Typography lineHeight={1.2} fontSize={15} variant="caption">
          {' '}
          for{' '}
        </Typography>{' '}
        <RegionSelect lineHeight={1.2} fontSize={15} color="grey.700" />{' '}
        <Typography lineHeight={1.2} fontSize={15} variant="caption">
          {' '}
          in the U.S.{' '}
        </Typography>
      </Box>
      {metric.unit && (
        <Typography variant="caption" fontStyle="italic" color="grey.700" mb={0.5}>
          Values represent {metric.unit}
        </Typography>
      )}
      <ChoroplethScale style={{ margin: '0px -15px -8px' }} />
      {children}
      {/* TODO: split selected locations into separate component */}
      {selected.length > 0 && (
        <>
          <Divider sx={{ width: 'calc(100% + 32px)', mt: 2, mb: 1, ml: -2, mr: -2 }} />
          <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" fontWeight="bold">
              Selected Locations
            </Typography>
            <IconButton size="small" sx={{ mr: -0.5 }} onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse sx={{ width: '100%' }} in={expanded}>
            <List
              ref={listRef}
              sx={{
                width: `calc(100% + 32px)`,
                ml: -2,
                mr: -2,
                pt: 1,
                pb: 1,
                mb: -1,
                maxHeight: 268,
                overflow: 'auto',
              }}
            >
              {selected.map((feature) => {
                const [name, parent] = getLocationNameParts(feature.properties);
                return (
                  <LocationListItem
                    key={feature.id}
                    name={name}
                    parent={parent}
                    color={feature?.properties?.color}
                    value={metric.shortFormatter(feature?.properties?.[metric_id])}
                    performance={feature?.properties?.[`${metric_id}_p`]}
                    onDismiss={(event) => {
                      removeSelected(feature);
                      event.stopPropagation();
                      event.preventDefault();
                    }}
                    onClick={() => {
                      // features from tileset might have a partial _geometry instead of geometry property.
                      // not full accurate, but better than nothing!
                      const flyFeature = feature.geometry
                        ? feature
                        : {
                            ...feature,
                            geometry: feature._geometry,
                          };
                      flyToFeature(flyFeature);
                    }}
                  ></LocationListItem>
                );
              })}
            </List>
          </Collapse>
          <Button fullWidth onClick={handleShowFullData}>
            View Full Data For Locations
          </Button>
        </>
      )}
    </LegendContainer>
  );
};

export default Legend;
