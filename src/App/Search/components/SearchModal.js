import { Box, Modal, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import shallow from 'zustand/shallow';
import { SearchInput } from '../../components';
import { useSearchStore } from '../';

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
  const [modalOpened, setModalOpened] = useSearchStore(
    (state) => [state.modalOpened, state.setModalOpened],
    shallow,
  );

  const handleClose = () => {
    setModalOpened(false);
  };

  return (
    <Modal
      keepMounted
      open={modalOpened}
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
