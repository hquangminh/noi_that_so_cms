import apiHandler from 'api-configs/api-handler';
import apiConstant from 'api-configs/api-constants';
import { OrderProductItem } from 'interface/Order';

const orderServices = {
  updateProductQuantity: async (body: { order_id: number; products: { id: number; quantity: number }[] }) => {
    const resp = await apiHandler.update(apiConstant.order + '/update-quantity', body);
    return resp.data;
  },

  addProduct: async (body: { order_id: number; products: Omit<OrderProductItem, 'id' | 'product'>[] }) => {
    const resp = await apiHandler.update(apiConstant.order + '/add-product', body);
    return resp.data;
  },

  cancel: async (body: { order_id: number; note: string }) => {
    const resp = await apiHandler.update(apiConstant.order + '/cancel', body);
    return resp.data;
  },
};

export default orderServices;
