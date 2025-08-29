import { createTheme } from '@mui/material/styles';

// Custom color palettes
const neutral = {
  black: '#263238',
  darkGrey: '#4D4D4D',
  grey: '#717171',
  lightGrey: '#89939E',
  greyBlue: '#ABBED1',
  silver: '#F5F7FA',
  white: '#FFFFFF',
};

const greenShades = {
  shade1: '#43A046', // Lightest
  shade2: '#388E3B',
  shade3: '#2E7D31',
  shade4: '#1B5E1F',
  shade5: '#103E13', // Darkest
};

const greenTints = {
  tint1: '#66BB69', // Darkest
  tint2: '#81C784',
  tint3: '#A5D6A7',
  tint4: '#C8E6C9',
  tint5: '#E8F5E9', // Lightest
};

// MUI palette
const palette = {
  primary: {
    main: greenShades.shade1,
    light: greenTints.tint1,
    dark: greenShades.shade5,
    contrastText: neutral.white,
  },
  secondary: {
    main: neutral.black,
    light: '#37474F',
    dark: '#1B262C',
    contrastText: neutral.white,
  },
  success: {
    main: greenShades.shade3,
    light: greenTints.tint1,
    dark: greenShades.shade1,
    contrastText: neutral.white,
  },
  error: {
    main: '#E53835',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: neutral.white,
  },
  warning: {
    main: '#FBC02D',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: neutral.black,
  },
  info: {
    main: '#2194F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: neutral.white,
  },
  // custom colors
  neutral,
  greenShades,
  greenTints,
  // MUI required properties
  grey: {
    50: neutral.silver,
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: neutral.lightGrey,
    700: neutral.grey,
    800: neutral.darkGrey,
    900: neutral.black,
  },
  background: {
    default: neutral.silver,
    paper: neutral.white,
  },
  text: {
    primary: neutral.black,
    secondary: neutral.lightGrey,
    disabled: '#BDBDBD',
  },
};

// TerraHarbor typography
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.00735em',
    color: neutral.black,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.0075em',
    color: neutral.black,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
    color: neutral.lightGrey,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.00714em',
    color: neutral.lightGrey,
  },

  // Body Regular
  body1: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.56,
    letterSpacing: '0.00938em',
    color: neutral.black,
  },
  body2: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.01071em',
    color: neutral.lightGrey,
  },
  body3: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
    color: neutral.black,
  },
  body4: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0.03333em',
    color: neutral.black,
  },

  // Body Medium
  body1Medium: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.56,
    letterSpacing: '0.00938em',
    color: neutral.black,
  },
  body2Medium: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.01071em',
    color: neutral.black,
  },
  body3Medium: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
    color: neutral.black,
  },
  body4Medium: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.33,
    letterSpacing: '0.03333em',
    color: neutral.black,
  },
  // Other typography
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.03333em',
    color: neutral.grey,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase' as const,
    color: neutral.lightGrey,
  },
};

// Create the theme

export { greenShades, greenTints, neutral };

export const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 8,
  },
  components: {
    // TerraHarbor component styles
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 5,
          textTransform: 'uppercase',
          fontWeight: 500,
          padding: '8px 20px',
          fontSize: theme.typography.button.fontSize,
          letterSpacing: theme.typography.button.letterSpacing,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        }),
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.grey[300],
          color: theme.palette.grey[600],
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: greenTints.tint5,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          border: '1px solid',
          borderColor: theme.palette.grey[200],
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[4],
            borderColor: theme.palette.grey[300],
          },
        }),
      },
    },
  },
});

export default theme;
