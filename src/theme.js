import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D7682',
    },
    secondary: {
      main: '#DB8741',
    },
    background: {
      dark: '#142324',
    },
  },
  typography: {
    fontFamily: 'proxima-nova, sans-serif',
    fontWeightBold: 600,
    fontWeightRegular: 400,
    h1: {
      fontSize: '2.4rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '24px',
          boxShadow: 'none',
        },
        outlined: {
          borderRadius: '24px',
          boxShadow: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#142324',
          fontSize: '0.75rem',
        },
        arrow: {
          color: '#142324',
        },
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(4px)',
      },
    },
  },
});

export default theme;
