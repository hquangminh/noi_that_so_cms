import { notification } from 'antd';

const NotExecutedNotification = () =>
  notification.error({
    key: 'not-executed',
    message: 'Không thể thực hiện thao tác này',
    description: 'Vui lòng tải lại trang',
  });

export default NotExecutedNotification;
