import { notification } from 'antd';

export const AddProductSuccess = () => {
  notification.success({
    key: 'add-product-success',
    message: 'Tạo sản phẩm',
    description: 'Đã tạo sản phẩm thành công',
  });
};

export const AddProductFail = () => {
  notification.error({
    key: 'add-product-success',
    message: 'Tạo sản phẩm',
    description: 'Tạo sản phẩm thất bại. Vui lòng thử lại sau.',
  });
};

export const EditProductSuccess = () => {
  notification.success({
    key: 'edit-product-success',
    message: 'Chỉnh sửa sản phẩm',
    description: 'Đã chỉnh sửa sản phẩm thành công',
  });
};

export const EditProductFail = () => {
  notification.error({
    key: 'edit-product-success',
    message: 'Chỉnh sửa sản phẩm',
    description: 'Chỉnh sửa sản phẩm thất bại. Vui lòng thử lại sau.',
  });
};

export const DeleteProductSuccess = () => {
  notification.success({
    key: 'delete-product-success',
    message: 'Xóa sản phẩm',
    description: 'Đã xóa sản phẩm thành công',
  });
};

export const DeleteProductFail = () => {
  notification.error({
    key: 'delete-product-success',
    message: 'Xóa sản phẩm',
    description: 'Xóa sản phẩm thất bại. Vui lòng thử lại sau.',
  });
};
