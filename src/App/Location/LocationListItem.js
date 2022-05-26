import { Close } from '@mui/icons-material';
import {
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import PerformanceIndicator from '../components/PerformanceIndicator';

const LocationColor = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 4,
  left: theme.spacing(2),
  top: 10,
  bottom: 10,
  borderRadius: 4,
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingTop: 0,
  paddingBottom: 0,
  width: `100%`,
  '& .MuiListItemText-primary': {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
  },
  '& .MuiListItemText-secondary': {
    fontSize: theme.typography.pxToRem(12),
  },
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
}));

const LocationListItem = ({ name, parent, value, performance, color, onDismiss, ...props }) => {
  return (
    <StyledListItem {...props}>
      {color && <LocationColor style={{ background: color }} />}
      <ListItemText primary={name} secondary={parent} />
      {performance && <PerformanceIndicator performance={performance} sx={{ mr: 1 }} />}
      {value && (
        <Typography sx={{ mr: onDismiss ? 4 : 0 }} fontWeight="bold">
          {value}
        </Typography>
      )}
      {onDismiss && (
        <ListItemSecondaryAction>
          <IconButton size="small" onClick={onDismiss}>
            <Close />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </StyledListItem>
  );
};

export default LocationListItem;
