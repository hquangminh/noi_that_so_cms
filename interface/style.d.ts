// styled.d.ts
import 'styled-components';
interface IPalette {
  main: string;
  mainBg?: string;
  contrastText: string;
}
// we'll use a very simple theme with  palette and colors
declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    borderRadius: string;
    borderColor: string;
    bodyColor: string;
    textColor: string;

    colorError?: string;

    palette: {
      common: {
        black: string;
        white: string;
      };
      primary: IPalette;
    };
  }
}
