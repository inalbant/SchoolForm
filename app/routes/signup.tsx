import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { z } from 'zod';
import { signupSchema } from '~/schemas/authForm';
import { authenticator, createUser } from '~/services/auth.server';

export default function SignupPage() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required />
        {actionData?.errors?.email && <p>{actionData.errors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
        {actionData?.errors?.password && <p>{actionData.errors.password[0]}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
        />
        {actionData?.errors?.confirmPassword && (
          <p>{actionData.errors.confirmPassword[0]}</p>
        )}
      </div>
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Sign up</button>
    </Form>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}

type ActionData =
  | { errors: z.inferFlattenedErrors<typeof signupSchema>['fieldErrors'] }
  | { error: string }
  | undefined;

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | ActionData> {
  const form = await request.clone().formData();
  //const form = await request.formData();

  const result = signupSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
    confirmPassword: form.get('confirmPassword'),
  });

  if (!result.success) {
    return json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(result.data.email, result.data.password);

    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/dashboard',
      context: { user },
    });
  } catch (error) {
    if (error instanceof Response) return error;

    return json({ error: 'Error creating user' }, { status: 400 });
  }
}
