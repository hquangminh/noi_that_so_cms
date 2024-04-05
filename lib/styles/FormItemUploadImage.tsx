import { styled } from 'styled-components';

const FormItemUploadImage = styled.div<{ background?: string }>`
  .ant-upload.ant-upload-select {
    display: inline-table;
    height: 100px !important;
    width: 100% !important;
    max-width: 100px;
    margin: 0 !important;
    border-radius: ${({ theme }) => theme.borderRadius} !important;
    background-color: ${({ background }) => background} !important;
    overflow: hidden;
    &:has(img) {
      border-style: solid !important;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .ant-form-item-has-error .ant-upload {
    border-color: #ff4d4f !important;
  }
`;

export default FormItemUploadImage;
