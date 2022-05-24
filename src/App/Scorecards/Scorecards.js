import { useLocationData } from '@hyperobjekt/react-dashboard';
import { styled, Box } from '@mui/material';
import { useRef } from 'react';
import { animated, useSpring, config } from '@react-spring/web';
import useCategorizedMetrics from '../IndicatorPanel/hooks/useCategorizedMetrics';
import { flattenMetricTree } from '../IndicatorPanel/utils';
import { getLocationNameParts } from '../utils';
import theme from '../../theme';
import { ScorecardTable } from './components/ScorecardTable';
import ScorecardTableStyle from './components/ScorecardTable.style';
import { ScorecardControls } from './components';
import { useDidMount } from 'rooks';
import useActiveView from '../hooks/useActiveView';

const StyledBox = styled(Box)`
  position: absolute;
  top: ${theme.spacing(8)};
  width: 100%;
  padding: ${theme.spacing(4, 3)};
  min-height: calc(100vh - ${theme.spacing(7)});
  z-index: 10;
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
  border-top: 1px solid ${theme.palette.grey['300']};
  ${theme.breakpoints.up('sm')} {
    min-height: calc(100vh - ${theme.spacing(8)});
  }
`;

const ScorecardSection = animated(StyledBox);

const Scorecards = ({ ...props }) => {
  const [activeView, setActiveView] = useActiveView();
  const tableRef = useRef(null);
  const active = activeView === 'scorecard';
  const initialRender = useRef(true);
  const springProps = useSpring({
    backdropFilter: active ? 'blur(5px)' : 'blur(0px)',
    opacity: active ? 1 : 0,
    background: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0)',
    config: config.molasses,
  });
  const controlsSpringProps = useSpring({
    to: { opacity: initialRender.current ? 0 : 1, y: 0 },
    from: { opacity: 0, y: -100 },
    reverse: !active,
    // reset: true,
    delay: !active ? 200 : 200,
  });
  const tableSpringProps = useSpring({
    to: { opacity: initialRender.current ? 0 : 1, y: 0 },
    from: { opacity: 0, y: -100 },
    reverse: !active,
    // reset: true,
    delay: !active ? 0 : 400,
  });
  const locations = useLocationData(5);
  const shapedLocations = locations.map((location) => {
    const [name, parentName] = getLocationNameParts(location);
    return {
      ...location,
      id: location.GEOID,
      name,
      parentName,
    };
  });
  const metrics = useCategorizedMetrics();
  useDidMount(() => {
    initialRender.current = false;
  });
  const flattenedMetrics = flattenMetricTree([], { children: metrics });
  const handleBackgroundClick = (e) => {
    if (e.target.className.includes('action--close-scorecards')) setActiveView('map');
  };
  const handleSectionNavigation = (e, section) => {
    tableRef.current.querySelector(`#scorecard-row-${section}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };
  return (
    <ScorecardSection
      id="scorecards"
      className="scorecard-section__root action--close-scorecards"
      active={active}
      style={{
        ...springProps,
        opacity: springProps.opacity.to((v) => (v === 0 ? 0 : 1)),
      }}
      onClick={handleBackgroundClick}
    >
      <Box className="action--close-scorecards" display="flex" gap={2} alignItems="flex-start">
        <ScorecardControls
          style={controlsSpringProps}
          onNavigateToSection={handleSectionNavigation}
        />
        <ScorecardTableStyle style={tableSpringProps}>
          <ScorecardTable locations={shapedLocations} metrics={flattenedMetrics} ref={tableRef} />
        </ScorecardTableStyle>
      </Box>
    </ScorecardSection>
  );
};

export default Scorecards;
