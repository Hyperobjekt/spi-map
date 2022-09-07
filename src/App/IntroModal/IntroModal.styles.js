import { styled } from '@mui/material';

export const Boxmodal = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const Description = styled('div')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(18),
  [theme.breakpoints.down('sm')]: {
    marginTop: 16,
    fontSize: theme.typography.pxToRem(16),
    textAlign: 'center',
  },
}));
