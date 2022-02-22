import { Box, Typography } from "@mui/material";
import React from "react";

/** Returns the title and subtitle values based on the data */
export const getNameParts = (fullName) => {
  if (!fullName) return ["Unavailable", ""];
  const [name, parent] = fullName.split(",");
  const parentName = parent || "United States";
  return [name, parentName];
};

const LocationName = ({ name: fullName, ...props }) => {
  const [name, parent] = getNameParts(fullName);
  return (
    <Box {...props}>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ m: 0, lineHeight: 1 }}
      >
        {name}
      </Typography>
      {parent && (
        <Typography
          component="span"
          variant="caption"
          color="textSecondary"
          sx={{ m: 0, lineHeight: 1 }}
        >
          {parent}
        </Typography>
      )}
    </Box>
  );
};

export default LocationName;
