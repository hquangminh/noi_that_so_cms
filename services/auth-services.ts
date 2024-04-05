import apiHandler from 'api-configs/api-handler';
import apiConstant from 'api-configs/api-constants';

const authServices = {
  login: async (body: { username: string; password: string }) => {
    const resp = await apiHandler.create(apiConstant.login, body);
    return resp.data;
  },

  me: async (token: string) => {
    const resp = await apiHandler.getAuth(apiConstant.me, token);
    return resp.data;
  },
};

export default authServices;
