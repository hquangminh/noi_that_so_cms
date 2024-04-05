import axios from 'axios';
import apiConstant from 'api-configs/api-constants';

type TableCheck = 'room-category' | 'style-category' | 'product-category' | 'blog-category' | 'seo-page';

const globalServices = {
  checkItemExist: async (params: Record<string, string | number | undefined>) => {
    const resp = await axios.get(apiConstant.checkItemExist, { params });
    return resp.data;
  },
};

export default globalServices;
