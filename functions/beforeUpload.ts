import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

import isFileAccepted, { FileRule } from './isFileAccepted';

const beforeUpload = (file: RcFile, rule?: FileRule, use?: 'upload' | 'upload-crop') => {
  const { formatPassed, sizePassed } = isFileAccepted(file, rule, true);

  if (!formatPassed || !sizePassed) return Upload.LIST_IGNORE;

  if (use === 'upload-crop') return formatPassed && sizePassed;

  return !(formatPassed && sizePassed);
};

export default beforeUpload;
