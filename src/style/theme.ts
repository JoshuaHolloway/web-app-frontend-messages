// import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import colors from '@style/colors.module.scss';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary, //'#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: colors.error, //', //red.A400,
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // -https://mui.com/api/button/
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '1rem',
        },
        contained: {
          color: 'white',
        },
      },
    },
  },
});

export default theme;
