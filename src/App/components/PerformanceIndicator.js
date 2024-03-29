import { Box, styled } from '@mui/material';

const getColorFromPerformance = (performance) => {
  switch (performance) {
    case 1:
      return '#D1605E';
    case 2:
      return '#E7CA60';
    case 3:
      return '#3e8ace';
    case 4:
      return '#6A9F58';
    case 5:
      return '#6A9F58';
    default:
      return '#eee';
  }
};

const PerformanceIndicator = styled(Box)`
  min-width: 12px;
  min-height: 12px;
  border-radius: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  background: ${(props) => getColorFromPerformance(props.performance)};
`;

export default PerformanceIndicator;
