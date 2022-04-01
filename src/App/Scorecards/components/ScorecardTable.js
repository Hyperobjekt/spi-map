import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import React from "react";
import ScorecardHeaderCell from "./ScorecardHeaderCell";
import ScorecardValueCell from "./ScorecardValueCell";
import { getFormatter } from "@hyperobjekt/react-dashboard";

export const ScorecardTable = React.forwardRef(
  ({ locations: baseLocations, metrics: baseMetrics, ...props }, ref) => {
    // TODO: use real data for demographics
    const locations = baseLocations.map((l) => ({
      ...l,
      dem: "",
      dem_pop: 124156,
      dem_mhi: 50659,
      dem_pr: 0.165,
      age: "",
      age_019: 0.122,
      age_2039: 0.25,
      age_4059: 0.375,
      age_60: 0.168,
      race: "",
      race_w: 0.25,
      race_b: 0.25,
      race_h: 0.25,
      race_a: 0.25,
    }));
    const metrics = [
      ...baseMetrics,
      { id: "dem", name: "Demographics", depth: 0 },
      { id: "overview", name: "Overview", depth: 1 },
      {
        id: "dem_mhi",
        name: "Median Household Income",
        depth: 2,
        formatter: getFormatter("dollars"),
      },
      {
        id: "dem_pr",
        name: "Poverty Rate",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      { id: "age", name: "Age Groups", depth: 1 },
      {
        id: "age_019",
        name: "0-19",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "age_2039",
        name: "20-39",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "age_4059",
        name: "40-59",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "age_60",
        name: "60+",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      { id: "race", name: "Race / Ethnicity", depth: 1 },
      {
        id: "race_a",
        name: "% Asian",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "race_b",
        name: "% Black",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "race_h",
        name: "% Hispanic",
        depth: 2,
        formatter: getFormatter("percent"),
      },
      {
        id: "race_w",
        name: "% White",
        depth: 2,
        formatter: getFormatter("percent"),
      },
    ];
    return (
      <TableContainer ref={ref} {...props}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ width: `${100 / (locations.length + 1)}%` }}
                className="scorecard__label-cell"
              />
              {locations.map((location) => (
                <ScorecardHeaderCell
                  key={location.id}
                  color={location.color}
                  name={location.name}
                  parentName={location.parentName}
                  style={{
                    width: `${100 / (locations.length + 1)}%`,
                  }}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={metric.id}
                  className={clsx(
                    "scorecard__row",
                    "scorecard__row--depth" + metric.depth
                  )}
                >
                  <TableCell className="scorecard__label-cell">
                    {/* SCROLL TARGET: offset by 90px to make room for header */}
                    <span
                      id={`scorecard-row-${metric.id}`}
                      style={{
                        width: "1px",
                        height: "1px",
                        position: "absolute",
                        marginTop: -90,
                      }}
                    />
                    <Typography className="scorecard__metric-label">
                      {metric.name}
                    </Typography>
                  </TableCell>
                  {locations.map((location) => {
                    const value = location[metric.id];
                    const performance = location[metric.id + "_p"];
                    const showPercent = ["age_", "race_"].some((prefix) =>
                      metric.id.startsWith(prefix)
                    );
                    // TODO: these are placeholder percentValues for prototyping.
                    //   need to calculate real % values where largest value = 1 (100%)
                    const percentValues = {
                      age_019: 0.3157894736842105,
                      age_2039: 0.657894736842105,
                      age_4059: 1, // 0.375,
                      age_60: 0.4473684210526316,
                      race_w: 1,
                      race_b: 1,
                      race_h: 1,
                      race_a: 1,
                    };
                    return (
                      <ScorecardValueCell
                        key={location.id}
                        value={
                          metric.formatter ? metric.formatter(value) : value
                        }
                        performance={performance}
                        percent={
                          showPercent ? percentValues[metric.id] : undefined
                        }
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);
