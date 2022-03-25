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

export const ScorecardTable = React.forwardRef(
  ({ locations, metrics, ...props }, ref) => {
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
                    return (
                      <ScorecardValueCell
                        key={location.id}
                        value={
                          metric.formatter ? metric.formatter(value) : value
                        }
                        performance={performance}
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
