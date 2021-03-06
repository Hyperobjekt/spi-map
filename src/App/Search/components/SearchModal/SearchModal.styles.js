import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: 640,
  minHeight: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  borderRadius: '12px',
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
}));

export const InputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #E0E0E0',
  '& .react-autosuggest__container': {
    flexGrow: 1,
    '& .react-autosuggest__input': {
      width: '100%',
      border: 'none',
      background: 'transparent',
      padding: '1.5rem 0',
      fontSize: '1.25rem',
      '&:focus': {
        // border: 0,
        outline: 'none',
      },
    },
    '& .react-autosuggest__suggestions-container': {
      position: 'absolute',
      top: '56px',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #E0E0E0',
      marginRight: '2.5rem',
      zIndex: 1,
      '& .react-autosuggest__suggestions-list': {
        listStyleType: 'none',
        lineHeight: 1.8,
        padding: '0 1rem',
        '& .react-autosuggest__suggestion': {
          //
        },
      },
    },
  },
}));

export const Content = styled('div')(({ theme }) => ({
  padding: '1.5rem',
}));

export const SuggestionDiv = styled('div')({
  cursor: 'pointer',
  padding: '0 1rem',
  '&:hover': {
    backgroundColor: '#0D7682',
    color: '#FFF',
  },
});
