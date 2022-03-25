import { TableCell } from "@mui/material";
import React from "react";

const ScorecardLabelCell = ({ name, depth, ...props }) => {
  return (
    <TableCell {...props}>
      <Typography className="scorecard__label">{name}</Typography>
    </TableCell>
  );
};

export default ScorecardLabelCell;
