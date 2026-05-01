import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976D2',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#00ACC1',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans SC", sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 500,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

export const colors = {
  primary: '#1976D2',
  primaryDark: '#0D47A1',
  secondary: '#00ACC1',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#2D2D2D',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  heatHigh: '#FF5722',
  heatLow: '#2196F3',
};
