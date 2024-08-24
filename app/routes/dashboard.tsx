import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/' });
}

export default function Screen() {
  return (
    <>
      <h1>Dashboard</h1>
      <Form method="post">
        <button>Sign Out</button>
      </Form>
    </>
  );
}
