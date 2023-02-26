import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#df9c4b',
    },
    secondary: {
      main: '#5caccf',
    },
    error: {
      main: '#df0000',
    },
    warning: {
      main: '#ffbb00',
    },
    info: {
      main: '#abdde0',
    },
    success: {
      main: '#2d773a',
    },
    background: {
      default: 'rgba(255, 252, 238, 0.8)',
      paper:'rgba(255, 252, 238, 0.8)',
    }
  },
});

export const useStyles = makeStyles({
  defaultStyle: {
    backgroundColor: theme.palette.background.default,
    padding: 15,
    borderRadius: 3,
    margin: '20px 0px 20px 0px',
  },
  header: {
    backgroundColor: 'rgba(255, 252, 238, 0.8)',
    margin: '10px 0px 20px 0px',
    padding: 15,
    borderRadius: 3,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
  },
  footer: {
  },
  navSeparator: {
    width: "1px",
    height: "20px",
    margin: "0 10px",
    borderLeft: "1px solid #606060",
  },
});

export default theme;
