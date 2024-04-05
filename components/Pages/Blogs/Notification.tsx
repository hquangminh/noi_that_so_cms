import { notification } from 'antd';

export const AddBlogCategorySuccess = () => {
  notification.success({
    key: 'add-blog-category-success',
    message: 'Tạo danh mục',
    description: 'Tạo danh mục thành công',
  });
};

export const AddBlogCategoryFail = () => {
  notification.error({
    key: 'add-blog-category-fail',
    message: 'Tạo danh mục',
    description: 'Tạo danh mục thất bại',
  });
};

export const EditBlogCategorySuccess = () => {
  notification.success({
    key: 'edit-blog-category-fail',
    message: 'Chỉnh sửa danh mục',
    description: 'Chỉnh sửa danh mục thành công',
  });
};

export const EditBlogCategoryFail = () => {
  notification.error({
    key: 'edit-blog-category-fail',
    message: 'Chỉnh sửa danh mục',
    description: 'Chỉnh sửa danh mục thất bại',
  });
};

export const DeleteBlogCategorySuccess = () => {
  notification.success({
    key: 'delete-blog-category-success',
    message: 'Xóa danh mục',
    description: 'Xóa danh mục thành công',
  });
};

export const DeleteBlogCategoryFail = () => {
  notification.error({
    key: 'delete-blog-category-fail',
    message: 'Xóa danh mục',
    description: 'Xóa danh mục thất bại',
  });
};

export const CantDeleteBlogCategoryUsed = () => {
  notification.warning({
    key: 'delete-blog-category-used',
    message: 'Xóa danh mục',
    description: 'Không thể xóa danh mục đang được sử dụng',
  });
};

export const AddBlogSuccess = () => {
  notification.success({
    key: 'add-blog-success',
    message: 'Thêm bài viết Blog',
    description: 'Thêm bài viết Blog thành công',
  });
};

export const AddBlogFail = () => {
  notification.error({
    key: 'add-blog-success',
    message: 'Thêm bài viết Blog',
    description: 'Đã xảy ra lỗi, vui lòng thử lại sau',
  });
};

export const EditBlogSuccess = () => {
  notification.success({
    key: 'edit-blog-success',
    message: 'Chỉnh sửa bài viết Blog',
    description: 'Chỉnh sửa bài viết Blog thành công',
  });
};

export const EditBlogFail = () => {
  notification.error({
    key: 'edit-blog-success',
    message: 'Chỉnh sửa bài viết Blog',
    description: 'Đã xảy ra lỗi, vui lòng thử lại sau',
  });
};

export const DeleteBlogSuccess = () => {
  notification.success({
    key: 'delete-blog-success',
    message: 'Xóa bài viết Blog',
    description: 'Xóa bài viết Blog thành công',
  });
};

export const DeleteBlogFail = () => {
  notification.error({
    key: 'delete-blog-fail',
    message: 'Xóa bài viết Blog',
    description: 'Xóa bài viết Blog thất bại',
  });
};
