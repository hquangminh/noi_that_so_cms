import { notification } from 'antd';

// Room Category
export const AddRoomTypeSuccess = () => {
  notification.success({
    key: 'add-room-type-success',
    message: 'Tạo loại phòng',
    description: 'Đã tạo thành công',
  });
};

export const AddRoomTypeFail = () => {
  notification.error({
    key: 'add-room-type-fail',
    message: 'Tạo loại phòng',
    description: 'Không thể tạo loại phòng. Vui lòng thử lại sau.',
  });
};

export const EditRoomTypeSuccess = () => {
  notification.success({
    key: 'edit-room-type-success',
    message: 'Chỉnh sửa loại phòng',
    description: 'Đã chỉnh sửa thành công',
  });
};

export const EditRoomTypeFail = () => {
  notification.error({
    key: 'edit-room-type-fail',
    message: 'Chỉnh sửa loại phòng',
    description: 'Không thể chỉnh sửa loại phòng. Vui lòng thử lại sau.',
  });
};

export const DeleteRoomTypeSuccess = () => {
  notification.success({
    key: 'delete-room-type-success',
    message: 'Xóa loại phòng',
    description: 'Đã xóa thành công',
  });
};

export const DeleteRoomTypeFail = () => {
  notification.error({
    key: 'delete-room-type-success',
    message: 'Xóa loại phòng',
    description: 'Xóa thất bại. Vui lòng thử lại sau.',
  });
};

export const CantDeleteRoomTypeUsed = () => {
  notification.error({
    key: 'delete-room-type-success',
    message: 'Xóa loại phòng',
    description: 'Không thể xóa loại phòng đang được sử dụng.',
  });
};

// Style Category
export const AddStyleTypeSuccess = () => {
  notification.success({
    key: 'add-style-type-success',
    message: 'Tạo phong cách',
    description: 'Đã tạo thành công',
  });
};

export const AddStyleTypeFail = () => {
  notification.error({
    key: 'add-style-type-fail',
    message: 'Tạo phong cách',
    description: 'Không thể tạo phong cách. Vui lòng thử lại sau.',
  });
};

export const EditStyleTypeSuccess = () => {
  notification.success({
    key: 'edit-style-type-success',
    message: 'Chỉnh sửa phong cách',
    description: 'Đã chỉnh sửa thành công',
  });
};

export const EditStyleTypeFail = () => {
  notification.error({
    key: 'edit-style-type-fail',
    message: 'Chỉnh sửa phong cách',
    description: 'Không thể chỉnh sửa phong cách. Vui lòng thử lại sau.',
  });
};

export const DeleteStyleTypeSuccess = () => {
  notification.success({
    key: 'delete-style-type-success',
    message: 'Xóa phong cách',
    description: 'Đã xóa thành công',
  });
};

export const DeleteStyleTypeFail = () => {
  notification.error({
    key: 'delete-style-type-success',
    message: 'Xóa phong cách',
    description: 'Xóa thất bại. Vui lòng thử lại sau.',
  });
};

export const CantDeleteStyleTypeUsed = () => {
  notification.error({
    key: 'delete-style-type-success',
    message: 'Xóa phong cách',
    description: 'Không thể xóa phong cách đang được sử dụng.',
  });
};

// Materia Category
export const AddMateriaSuccess = () => {
  notification.success({
    key: 'add-materia-success',
    message: 'Tạo vật liệu',
    description: 'Đã tạo thành công',
  });
};

export const AddMateriaFail = () => {
  notification.error({
    key: 'add-materia-fail',
    message: 'Tạo vật liệu',
    description: 'Không thể tạo vật liệu. Vui lòng thử lại sau.',
  });
};

export const EditMateriaSuccess = () => {
  notification.success({
    key: 'edit-materia-success',
    message: 'Chỉnh sửa vật liệu',
    description: 'Đã chỉnh sửa thành công',
  });
};

export const EditMateriaFail = () => {
  notification.error({
    key: 'edit-materia-fail',
    message: 'Chỉnh sửa vật liệu',
    description: 'Không thể chỉnh sửa vật liệu. Vui lòng thử lại sau.',
  });
};

export const DeleteMateriaSuccess = () => {
  notification.success({
    key: 'delete-materia-success',
    message: 'Xóa vật liệu',
    description: 'Đã xóa thành công',
  });
};

export const DeleteMateriaFail = () => {
  notification.error({
    key: 'delete-materia-success',
    message: 'Xóa vật liệu',
    description: 'Xóa thất bại. Vui lòng thử lại sau.',
  });
};

export const CantDeleteMateriaUsed = () => {
  notification.error({
    key: 'delete-materia-success',
    message: 'Xóa vật liệu',
    description: 'Không thể xóa vật liệu đang được sử dụng.',
  });
};

// Product Category
export const AddProductCategorySuccess = () => {
  notification.success({
    key: 'add-product-category-success',
    message: 'Tạo danh mục sản phẩm',
    description: 'Đã tạo thành công',
  });
};

export const AddProductCategoryFail = () => {
  notification.error({
    key: 'add-product-category-fail',
    message: 'Tạo danh mục sản phẩm',
    description: 'Không thể tạo danh mục sản phẩm. Vui lòng thử lại sau.',
  });
};

export const EditProductCategorySuccess = () => {
  notification.success({
    key: 'edit-product-category-success',
    message: 'Chỉnh sửa danh mục sản phẩm',
    description: 'Đã chỉnh sửa thành công',
  });
};

export const EditProductCategoryFail = () => {
  notification.error({
    key: 'edit-product-category-fail',
    message: 'Chỉnh sửa danh mục sản phẩm',
    description: 'Không thể chỉnh sửa danh mục sản phẩm. Vui lòng thử lại sau.',
  });
};

export const DeleteProductCategorySuccess = () => {
  notification.success({
    key: 'delete-product-category-success',
    message: 'Xóa danh mục sản phẩm',
    description: 'Đã xóa thành công',
  });
};

export const DeleteProductCategoryFail = () => {
  notification.error({
    key: 'delete-product-category-success',
    message: 'Xóa danh mục sản phẩm',
    description: 'Xóa thất bại. Vui lòng thử lại sau.',
  });
};

export const CantDeleteProductCategoryUsed = () => {
  notification.error({
    key: 'delete-product-category-fail',
    message: 'Xóa danh mục sản phẩm',
    description: 'Không thể xóa danh mục sản phẩm đang được sử dụng.',
  });
};
