import Router from 'next/router';
import Cookies, { CookieSetOptions } from 'universal-cookie';

const onLogout = async () => {
  const cookies = new Cookies();

  const options: CookieSetOptions = { path: '/' };
  cookies.remove('token', options);

  Router.replace('/login');
};

export default onLogout;
