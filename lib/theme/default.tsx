import { DefaultTheme } from 'styled-components';

const ThemeDefault: DefaultTheme = {
  name: 'default',
  borderRadius: '6px',
  borderColor: '#d9d9d9',
  bodyColor: '#ffffff',
  textColor: '#000000',

  colorError: '#ff4d4f',

  palette: {
    common: {
      black: '#121212',
      white: '#ffffff',
    },
    primary: {
      main: '#679b86',
      mainBg: '#cedbd4',
      contrastText: '#ffffff',
    },
  },
};

export default ThemeDefault;
