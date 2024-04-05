import { ConfigProviderProps } from 'antd/es/config-provider';
import viVN from 'antd/locale/vi_VN';

const AntDesignConfigs: ConfigProviderProps = {
  locale: viVN,
  theme: {
    token: {
      colorPrimary: '#679b86',
    },
  },
  form: {
    validateMessages: {
      required: 'Vui lòng nhập ${label}!',
      whitespace: '${label} không được chứa mỗi khoảng trắng',
      types: { integer: '${label} phải là số nguyên' },
    },
  },
  pagination: { showSizeChanger: false },
};

export default AntDesignConfigs;
