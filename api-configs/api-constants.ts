const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

const apiConstant = Object.freeze({
  me: `${API_HOST}/me`,
  login: `${API_HOST}/login`,
  checkItemExist: `${API_HOST}/item-already-exist`,
  product: `${API_HOST}/product`,
  order: `${API_HOST}/order`,
});

export default apiConstant;
