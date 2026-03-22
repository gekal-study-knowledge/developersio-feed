'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#157878', // Cayman theme blue-green
          light: '#2aa1a1',
          dark: '#0d5a5a',
        },
        secondary: {
          main: '#f39c12', // Classmethod Orange
          light: '#ffb142',
          dark: '#d68910',
        },
        background: {
          default: '#f4f7f6',
          paper: '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#2aa1a1', // Lighter teal for dark mode
          light: '#4dbfbf',
          dark: '#157878',
        },
        secondary: {
          main: '#f39c12',
          light: '#ffb142',
          dark: '#d68910',
        },
        background: {
          default: '#0d1117',
          paper: '#161b22',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.markdown-body': {
          wordBreak: 'break-all',
          overflowWrap: 'break-word',
        },
        '& table': {
          display: 'block',
          width: '100% !important',
          maxWidth: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderCollapse: 'collapse',
          whiteSpace: 'nowrap',
        },
        '& th, & td': {
          padding: '8px 16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Disable MUI v5 dark mode elevation overlay
        },
      },
    },
  },
});

export default theme;
