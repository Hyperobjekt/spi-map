import { TableCell, Typography, Box, styled } from '@mui/material';
import clsx from 'clsx';
import PerformanceIndicator from '../../components/PerformanceIndicator';

// TODO: split "PercentBar" into separate component
const PercentBarStyle = styled(Box)`
  position: relative;
  width: 56px;
  height: 6px;
  .percent-bar__track {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 6px;
    height: 100%;
    background-color: currentColor;
    opacity: 0.15;
    width: 100%;
  }
  .percent-bar__value {
    position: relative;
    z-index: 2;
    background-color: currentColor;
    height: 100%;
    border-radius: 6px;
    min-width: 6px;
  }
`;

// TODO: split "PercentBar" into separate component
const PercentBar = ({ percent = 0, className, ...props }) => {
  return (
    <PercentBarStyle className={clsx('percent-bar__root', className)} {...props}>
      <div className="percent-bar__track" />
      <div className="percent-bar__value" style={{ width: percent * 100 + '%' }} />
    </PercentBarStyle>
  );
};

/**
 * Renders a value in the table cell along with a performance indicator or percent bar.
 */
const ScorecardValueCell = ({
  value,
  selected,
  performance,
  percent,
  className,
  children,
  ...props
}) => {
  return (
    <TableCell className={clsx(className, 'scorecard__value-cell')} {...props}>
      <Box
        className={clsx('scorecard__value-wrapper', {
          'scorecard__value-wrapper--percent': percent,
        })}
      >
        {percent && <PercentBar percent={percent} sx={{ mr: 1, color: 'primary.main' }} />}
        <Typography className="scorecard__value">{value}</Typography>
        {Number.isFinite(performance) && (
          <Box className="scorecard__perf-wrapper">
            <PerformanceIndicator className="scorecard__perf-circle" performance={performance} />
          </Box>
        )}
      </Box>
      {children}
    </TableCell>
  );
};

export default ScorecardValueCell;
