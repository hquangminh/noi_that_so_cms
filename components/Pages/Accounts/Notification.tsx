import { notification } from 'antd';

export const AddAccountSuccess = () => {
  notification.success({
    key: 'add-account-success',
    message: 'Tạo quản trị viên',
    description: 'Đã thêm thành công',
  });
};

export const AddAccountFail = () => {
  notification.error({
    key: 'add-account-fail',
    message: 'Tạo quản trị viên',
    description: 'Không thể tạo quản trị viên. Vui lòng thử lại sau.',
  });
};

export const EditAccountSuccess = () => {
  notification.success({
    key: 'edit-account-success',
    message: 'Chỉnh sửa quản trị viên',
    description: 'Đã chỉnh sửa thành công',
  });
};

export const EditAccountFail = () => {
  notification.error({
    key: 'edit-account-fail',
    message: 'Chỉnh sửa quản trị viên',
    description: 'Không thể chỉnh sửa quản trị viên. Vui lòng thử lại sau.',
  });
};

export const DeleteAccountSuccess = () => {
  notification.success({
    key: 'delete-account-success',
    message: 'Xóa quản trị viên',
    description: 'Đã xóa thành công',
  });
};

export const DeleteAccountFail = () => {
  notification.error({
    key: 'delete-account-success',
    message: 'Xóa quản trị viên',
    description: 'Xóa thất bại. Vui lòng thử lại sau.',
  });
};

export const CantDeleteMySelf = () => {
  notification.warning({
    key: 'delete-account-my-self',
    message: 'Xóa quản trị viên',
    description: 'Không thể xóa chính bạn',
  });
};
