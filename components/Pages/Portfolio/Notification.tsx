import { notification } from 'antd';

export const AddPortfolioSuccess = () => {
  notification.success({
    key: 'add-portfolio-success',
    message: 'Thêm Portfolio',
    description: 'Đã thêm Portfolio thành công',
  });
};

export const AddPortfolioFail = () => {
  notification.error({
    key: 'add-portfolio-success',
    message: 'Thêm Portfolio',
    description: 'Thêm Portfolio thất bại. Vui lòng thử lại sau.',
  });
};

export const EditPortfolioSuccess = () => {
  notification.success({
    key: 'edit-portfolio-success',
    message: 'Chỉnh sửa Portfolio',
    description: 'Đã chỉnh sửa Portfolio thành công',
  });
};

export const EditPortfolioFail = () => {
  notification.error({
    key: 'edit-portfolio-success',
    message: 'Chỉnh sửa Portfolio',
    description: 'Chỉnh sửa Portfolio thất bại. Vui lòng thử lại sau.',
  });
};

export const DeletePortfolioSuccess = () => {
  notification.success({
    key: 'delete-portfolio-success',
    message: 'Xóa Portfolio',
    description: 'Đã xóa Portfolio thành công',
  });
};

export const DeletePortfolioFail = () => {
  notification.error({
    key: 'delete-portfolio-success',
    message: 'Xóa Portfolio',
    description: 'Xóa Portfolio thất bại. Vui lòng thử lại sau.',
  });
};
