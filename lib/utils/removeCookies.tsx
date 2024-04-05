import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function removeCookies(cookiesName: string | string[]) {
  if (typeof cookiesName === 'string') cookies.remove(cookiesName, { path: '/' });
  for (const name of cookiesName) {
    cookies.remove(name, { path: '/' });
  }
}
