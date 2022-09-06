import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 640,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.25)',
  borderRadius: '12px',
}));

export const Content = styled('div')(({ theme }) => ({
  padding: '3rem 4rem',
  outline: 'none !important',
  flex: 1,
  display: 'flex',
  flexFlow: 'column nowrap',
}));
