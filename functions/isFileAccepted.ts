import { message } from 'antd';
import { RcFile } from 'antd/es/upload';

const imageSupport = ['png', 'jpg', 'jpeg', 'webp'];

type FileType = 'image' | 'video';
export type FileRule = { type?: FileType; format?: string[]; size?: number };

const isFileAccepted = (file: RcFile, rule: FileRule = {}, showNotification?: boolean) => {
  const { type = 'image', format = imageSupport, size = 2 } = rule;
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  let formatPassed: boolean = false;
  if (type === 'image' && file.type.startsWith('image/') && format.includes(fileExtension))
    formatPassed = true;

  const sizePassed = file.size / 1024 / 1024 < size;

  if (!(formatPassed && sizePassed) && showNotification) {
    const formatMsg = format.reduce((str: string, i) => (str += `${i.toUpperCase()}, `), '').slice(0, -2);
    message.error(`Chỉ hỗ trợ tệp có định dạng ${formatMsg} và có kích thước dưới ${size}MB`);
  }

  return { formatPassed, sizePassed };
};

export default isFileAccepted;
