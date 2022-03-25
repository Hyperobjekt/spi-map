import { TableCell, Typography, Box } from "@mui/material";
import clsx from "clsx";
import PerformanceIndicator from "../../components/PerformanceIndicator";

const ScorecardValueCell = ({
  value,
  selected,
  performance,
  className,
  children,
  ...props
}) => {
  return (
    <TableCell className={clsx(className, "scorecard__value-cell")} {...props}>
      <Box className="scorecard__value-wrapper">
        <Typography className="scorecard__value">{value}</Typography>
        <Box className="scorecard__perf-wrapper">
          <PerformanceIndicator
            className="scorecard__perf-circle"
            performance={performance}
          />
        </Box>
      </Box>
      {children}
    </TableCell>
  );
};

export default ScorecardValueCell;
