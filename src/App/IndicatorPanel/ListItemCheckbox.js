import React from 'react';
import { ListItemButton, Checkbox } from '@mui/material';

const ListItemCheckbox = ({ selected, children, itemProps, ...props }) => {
  return (
    <ListItemButton {...props}>
      <Checkbox checked={selected} />
      {children}
    </ListItemButton>
  );
};

export default ListItemCheckbox;
