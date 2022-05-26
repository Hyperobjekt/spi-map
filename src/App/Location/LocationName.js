import { Box, Typography } from '@mui/material';
import React from 'react';

const LocationName = ({ name, parent, ...props }) => {
  return (
    <Box {...props}>
      <Typography variant="body1" fontWeight="bold" sx={{ m: 0, lineHeight: 1 }}>
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
