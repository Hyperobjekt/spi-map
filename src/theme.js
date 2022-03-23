import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0D7682",
    },
    secondary: {
      main: "#DB8741",
    },
    background: {
      dark: "#142324",
    },
  },
  typography: {
    fontFamily: "proxima-nova, sans-serif",
    fontWeightBold: 600,
    fontWeightRegular: 400,
    h1: {
      fontSize: "2.4rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: "24px",
          boxShadow: "none",
        },
        outlined: {
          borderRadius: "24px",
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#142324",
          fontSize: "0.75rem",
        },
        arrow: {
          color: "#142324",
        },
      },
    },
  },
});

export default theme;
