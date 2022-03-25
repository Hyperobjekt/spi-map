import { Paper, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import clsx from "clsx";
import { NestedList } from "../../components";
import PerformanceIndicator from "../../components/PerformanceIndicator";
import { getLocationNameParts } from "../../utils";

const getDataMetricTree = (metric, data) => {
  const dataValue = data[metric.id];
  const dataRank = data[metric.id + "_r"];
  const dataPerformance = data[metric.id + "_p"];
  const children = metric.children?.map((child) =>
    getDataMetricTree(child, data)
  );
  return {
    ...metric,
    dataValue,
    dataRank,
    dataPerformance,
    children,
  };
};

const ScorecardItem = ({
  value,
  selected,
  itemProps,
  children,
  className,
  ...props
}) => {
  // console.log(itemProps);
  const { name, dataValue, dataPerformance, formatter } = itemProps;
  return (
    <Box
      component="li"
      className={clsx(className, "scorecard__row")}
      {...props}
    >
      <Typography className="scorecard__label">{name}</Typography>
      <Typography sx={{ marginLeft: "auto" }} className="scorecard__value">
        {formatter ? formatter(dataValue) : dataValue}
      </Typography>
      <Box className="scorecard__perf-wrapper">
        <PerformanceIndicator
          className="scorecard__perf-circle"
          performance={dataPerformance}
        />
      </Box>
    </Box>
  );
};

const ScorecardList = styled(NestedList)(({ theme }) => ({
  padding: 0,
  "& .MuiList-root": {
    padding: 0,
  },
}));

const Scorecard = ({ location, metrics, className, ...props }) => {
  const items = metrics.map((m) => getDataMetricTree(m, location || {}));
  const [name, parent] = location
    ? getLocationNameParts(location)
    : [null, null];
  return (
    <Paper className={clsx("scorecard__root", className)} {...props}>
      <div className="scorecard__header">
        <div
          style={{ backgroundColor: location?.color }}
          className="scorecard__location-color"
        />
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body1" color="textSecondary">
          {parent}
        </Typography>
      </div>
      <ScorecardList
        items={items}
        collapseDepths={[]}
        childComponent={ScorecardItem}
      />
    </Paper>
  );
};

export default Scorecard;
