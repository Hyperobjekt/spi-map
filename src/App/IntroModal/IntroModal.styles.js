import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 640,
  minHeight: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  borderRadius: '12px',
}));

export const Boxmodal = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const Content = styled('div')(({ theme }) => ({
  padding: '3rem 4rem',
  outline: 'none !important',
}));

export const Description = styled('div')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(18),
  [theme.breakpoints.down('md')]: {
    marginTop: 16,
    fontSize: theme.typography.pxToRem(16),
    textAlign: 'center',
  },
}));

export const Buttoncontainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const Label = styled('div')(({ theme }) => ({
  padding: '0.5rem 0',
  fontSize: theme.typography.pxToRem(16),
  textAlign: 'center',
}));
