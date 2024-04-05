import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  *::-webkit-scrollbar {
    background-color: #fff;
    width: 16px;
  }
  *::-webkit-scrollbar-track {
    /* background of the scrollbar except button or resizer */
    background-color: #fff;
  }
  *::-webkit-scrollbar-thumb {
    /* scrollbar itself */
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #fff;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: #7d7d7d;
  }
  *::-webkit-scrollbar-button {
    /* set button(top and bottom of the scrollbar) */
    display:none;
  }

  html,
  body {
    height: 100%;
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  html {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
  }

  html:lang(ko) {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    word-break: keep-all;
  }

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  a,
  button,
  input {
    outline: none;
  }

  a,
  button {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  // Hide Arrows From Input Number
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }

  #nprogress 
    .spinner {
      display: none !important;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      top: 0 !important;
      right: 0 !important;
    }
    .spinner-icon {
      position: absolute;
      top: 50%;
      left: 50%;
    }
`;

export default GlobalStyle;
