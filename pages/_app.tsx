import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';

import NextNProgress from 'nextjs-progressbar';

import { ThemeProvider } from 'styled-components';

import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

import store from 'store';

import { ThemeDefault } from 'lib/theme';
import { AntDesignConfigs } from 'lib/configs';

import { GlobalStyle, AntdStyle } from 'lib/styles';

import 'antd/dist/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <StyleProvider hashPriority='high'>
          <ConfigProvider {...AntDesignConfigs}>
            <ThemeProvider theme={ThemeDefault}>
              <GlobalStyle />
              <AntdStyle />
              <Component {...pageProps} />
            </ThemeProvider>
          </ConfigProvider>
        </StyleProvider>
      </Provider>

      <NextNProgress showOnShallow={false} />
    </>
  );
}
