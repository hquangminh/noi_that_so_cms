import { notification } from 'antd';

export const AddPartnerSuccess = () => {
  notification.success({
    key: 'add-partner-success',
    message: 'Thêm đối tác',
    description: 'Đã thêm đối tác thành công.',
  });
};

export const AddPartnerFailure = () => {
  notification.error({
    key: 'add-partner-failure',
    message: 'Thêm đối tác',
    description: 'Không thể thêm đối tác. Vui lòng thử lại sau.',
  });
};

export const ApprovePartnerSuccess = () => {
  notification.success({
    key: 'approve-partner-success',
    message: 'Phê duyệt đối tác',
    description: 'Đối tác đã được phê duyệt thành công.',
  });
};

export const ApprovePartnerFailure = () => {
  notification.error({
    key: 'approve-partner-failure',
    message: 'Phê duyệt đối tác',
    description: 'Không thể phê duyệt đối tác. Vui lòng thử lại sau.',
  });
};

export const RejectPartnerSuccess = () => {
  notification.success({
    key: 'reject-partner-success',
    message: 'Từ chối đối tác',
    description: 'Đã từ chối đối tác thành công.',
  });
};

export const RejectPartnerFailure = () => {
  notification.error({
    key: 'reject-partner-failure',
    message: 'Từ chối đối tác',
    description: 'Không thể từ chối đối tác. Vui lòng thử lại sau.',
  });
};
