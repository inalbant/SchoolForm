import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { loginSchema } from '~/schemas/authForm';
import { authenticator } from '~/services/auth.server';

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  console.log('*** actionData is: ', actionData);

  return (
    <Form method="post">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" required />
      {actionData?.errors?.email && <p>{actionData.errors.email[0]}</p>}
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      {actionData?.errors?.password && <p>{actionData.errors.password[0]}</p>}
      <button>Sign In</button>
      {actionData?.errors && <p>{actionData.errors}</p>}
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.clone().formData();

  const result = loginSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  });

  if (!result.success) {
    return json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/dashboard',
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json({ errors: error.message }, { status: 400 });
    }
    return json({ errors: 'Something went wrong' }, { status: 400 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}
