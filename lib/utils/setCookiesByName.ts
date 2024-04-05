import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function setCookiesByName(name: string, value: string) {
  cookies.set(name, value, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
}
