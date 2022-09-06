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

export const Boxmodal = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const Description = styled('div')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(18),
  [theme.breakpoints.down('md')]: {
    marginTop: 16,
    fontSize: theme.typography.pxToRem(16),
    textAlign: 'center',
  },
}));
