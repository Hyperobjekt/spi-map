import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { AccountCircleOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { STAGE, useIntroModalStore } from '../IntroModal';
import shallow from 'zustand/shallow';

const ProfileMenu = () => {
  const [setIntroModalIsOpen, setIntroModalStage] = useIntroModalStore(
    (state) => [state.setOpen, state.setStage],
    shallow,
  );

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
        aria-label="Open to show more"
        title="Open to show more"
        size="large"
        sx={{ p: '8px', mr: '-8px', ml: '8px' }}
      >
        <AccountCircleOutlined fontSize="large" />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setIntroModalIsOpen(true);
            setIntroModalStage(STAGE.JUMP_TO);
          }}
        >
          About
        </MenuItem>
        <MenuItem onClick={() => signOut(getAuth())}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
