import apiHandler from 'api-configs/api-handler';
import apiConstant from 'api-configs/api-constants';

type ProductUpdate = {
  product: Record<string, any>;
  category: Record<string, any>[];
  room: Record<string, any>[];
  style: Record<string, any>[];
  hashtag: Record<string, any>[];
  option: Record<string, any>[];
  variation: Record<string, any>[];
};

const productServices = {
  update: async (id: number, body: ProductUpdate) => {
    const resp = await apiHandler.update(apiConstant.product + '/edit', body, { params: { id } });
    return resp.data;
  },
};

export default productServices;
