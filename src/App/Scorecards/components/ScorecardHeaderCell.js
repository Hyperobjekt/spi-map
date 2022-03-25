import { TableCell, Typography } from "@mui/material";
import React from "react";

const ScorecardHeaderCell = ({
  color,
  name,
  parentName,
  children,
  ...props
}) => {
  return (
    <TableCell className="scorecard__header" {...props}>
      <div
        style={{ backgroundColor: color }}
        className="scorecard__location-color"
      />
      <Typography className="scorecard__location-name" variant="h5">
        {name}
      </Typography>
      <Typography
        className="scorecard__location-parent"
        variant="body1"
        color="textSecondary"
      >
        {parentName}
      </Typography>
      {children}
    </TableCell>
  );
};

export default ScorecardHeaderCell;
