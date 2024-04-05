import { notification } from 'antd';

const CategoryAlreadyExist = () => {
  notification.error({
    key: 'category-is-exist',
    message: 'Danh mục đã tồn tại',
    description: 'Vui lòng thử lại với danh mục khác',
  });
};

export default CategoryAlreadyExist;
