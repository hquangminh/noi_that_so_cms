import { message } from 'antd';

const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value).then(() => message.success('Đã sao chép'));
};

export default copyToClipboard;
