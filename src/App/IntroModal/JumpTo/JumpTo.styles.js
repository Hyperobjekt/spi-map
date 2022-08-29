import { styled } from '@mui/material';

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
