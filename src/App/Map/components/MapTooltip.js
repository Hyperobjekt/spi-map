import { useDashboardStore, useMetricConfig } from '@hyperobjekt/react-dashboard';
import { useMapStore } from '@hyperobjekt/mapgl';
import { Divider, Paper, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { scaleLinear } from 'd3-scale';
import { LocationName } from '../../Location';
import { getLocationNameParts } from '../../utils';
import useMousePosition from '../../hooks/useMousePosition';

// tooltip dimensions (height is an estimate for offsets)
const TOOLTIP_WIDTH = 240;
const TOOLTIP_HEIGHT = 164;

const TooltipPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 101,
  width: TOOLTIP_WIDTH,
  pointerEvents: 'none',
}));

// create animated version of Paper for react-spring
const AnimatedPaper = animated(TooltipPaper);

// create a scale for offsetting the tooltip so it doesn't go off the screen
const offsetScaleY = (value) => {
  if (value > window.innerHeight - 64 - TOOLTIP_HEIGHT) {
    return -TOOLTIP_HEIGHT;
  }
  return 48;
};

const offsetScaleX = scaleLinear()
  .domain([0, window.innerWidth])
  .range([64, -1 * (TOOLTIP_WIDTH - 64)]);

const MapTooltip = ({ classes, yOffset = 0, xOffset = -64, ...props }) => {
  // retrieve required data for rendering the tooltip
  const data = useMapStore((state) => state.hoveredFeature)?.properties;
  const { x, y } = useMousePosition();
  const choroplethMetric = useDashboardStore((state) => state.choroplethMetric);

  // metric ids to render in the tooltip
  const tooltipMetrics = [choroplethMetric];
  const metricConfigs = useMetricConfig(tooltipMetrics);

  // y position with scroll factored in
  const adjustedY = y - window.scrollY;

  // animate position and opacity
  const style = useSpring({
    x: (x || 0) + offsetScaleX(x) + xOffset,
    y: (adjustedY || 0) + offsetScaleY(adjustedY) + yOffset,
    opacity: data ? 1 : 0,
  });

  // keep a ref to the data so we can gracefully fade out tooltip
  const dataRef = useRef(null);
  if (data) dataRef.current = data;

  // don't render anything if no tooltip data has been set yet
  if (!dataRef.current) return null;

  // get hovered feature name and parent location
  const [name, parent] = getLocationNameParts(dataRef.current);

  return (
    <AnimatedPaper style={style} elevation={3} {...props}>
      <LocationName name={name} parent={parent} p={2} pb={1.5} />
      <Divider />
      <Box display="flex" flexDirection="columns" alignItems="stretch">
        {metricConfigs.map((metric, i) => (
          <Box
            key={metric.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            p={2}
          >
            <Typography variant="body2">{metric.name}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {metric.formatter(dataRef.current[metric.id])}
            </Typography>
          </Box>
        ))}
      </Box>
    </AnimatedPaper>
  );
};

export default MapTooltip;
