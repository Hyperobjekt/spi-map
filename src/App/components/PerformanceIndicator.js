import { Box, styled } from '@mui/material';
import React from 'react';

const getColorFromPerformance = (performance) => {
  switch (performance) {
    case 1:
      return '#D1605E';
    case 2:
      return '#D1605E';
    case 3:
      return '#E7CA60';
    case 4:
      return '#6A9F58';
    case 5:
      return '#6A9F58';
    default:
      return '#eee';
  }
};

const PerformanceIndicator = styled(Box)`
  min-width: 8px;
  min-height: 8px;
  border-radius: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  background: ${(props) => getColorFromPerformance(props.performance)};
`;

// function PerformanceIndicator({size, performance, ...props}) {
//   return (
//     <div>PerformanceIndicator</div>
//   )
// }

export default PerformanceIndicator;
