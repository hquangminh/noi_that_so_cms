import { createGlobalStyle, css } from 'styled-components';

const AntCss = css`
  .ant-btn {
    &:has(> a:not(:empty)) {
      a {
        color: currentColor;
        &:after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: transparent;
          content: '';
        }
      }
      &:not(> span.ant-btn-icon):has(span[role='img']) span[role='img'] {
        margin-right: 5px;
      }
    }
    &:has(> span.ant-btn-icon) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  .ant-tag {
    &:has(> a) {
      position: relative;
      a:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: transparent;
        content: '';
      }
    }
  }

  .ant-typography {
    .ant-typography-copy {
      color: ${({ theme }) => theme.palette.primary.main} !important;
    }
    &:empty:has(.ant-typography-copy) .ant-typography-copy {
      margin-inline-start: 0px;
    }
  }

  .ant-form-item-explain[role='alert'].ant-form-item-explain-connected {
    font-size: 12px;
    & > div,
    .ant-form-item-explain-error {
      line-height: 22px;
    }
  }
`;

const AntdStyle = createGlobalStyle`
  ${AntCss}
`;

export default AntdStyle;
