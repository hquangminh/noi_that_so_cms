import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, Redirect } from 'next';
import authServices from 'services/auth-services';

export interface GetServerSidePropsContextWithContext extends GetServerSidePropsContext {
  auth?: any;
}

export type GetServerSidePropsWithSession<P extends { [key: string]: any } = { [key: string]: any }> = (
  context: GetServerSidePropsContextWithContext,
) => Promise<GetServerSidePropsResult<P>>;

const redirect: Redirect = { destination: '/login', statusCode: 302 };

export default function withAuth(gssp: GetServerSidePropsWithSession): GetServerSideProps & { user?: any } {
  return async (context) => {
    let auth = null;

    const token = context.req.cookies.token;

    const gsspData = await gssp(context);
    if (!('props' in gsspData)) throw new Error('invalid getSSP result');

    if (token) auth = (await authServices.me(token).then(({ data }) => data)) || null;
    if (!auth) context.res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0; path=/');

    return { props: { ...gsspData.props, auth } };
  };
}
