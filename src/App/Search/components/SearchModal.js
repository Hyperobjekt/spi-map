import React from 'react';
import { SearchInput } from '../../components';
import useSearchActive from '../hooks/useSearchActive';
import { visuallyHidden } from '@mui/utils';
import { Box, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '640px',
  minHeight: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '24px',
};

const SearchModal = () => {
  const [searchActive, setSearchActive] = useSearchActive();
  const handleClose = () => {
    setSearchActive(false);
  };
  return (
    <Modal
      keepMounted
      open={searchActive}
      onClose={handleClose}
      aria-labelledby="search-modal-title"
    >
      <Box sx={style}>
        <Typography id="search-modal-title" sx={visuallyHidden}>
          Find a Place
        </Typography>
        <Box>
          <SearchInput />
        </Box>
        <Box></Box>
      </Box>
    </Modal>
  );
};

export default SearchModal;
