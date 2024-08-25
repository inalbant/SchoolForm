import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { useActionData, useLocation } from '@remix-run/react';
import { newPasswordSchema } from '~/schemas/authForm';
import {
  changeUserPassword,
  verifyPasswordResetToken,
} from '~/services/auth.server';

export default function ResetPassword() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const actionData = useActionData<typeof action>();

  return (
    <form method="post">
      <input type="hidden" name="token" value={token!} />
      <label htmlFor="newPassword">New Password</label>
      <input type="password" name="newPassword" required />
      {actionData?.errors?.newPassword && (
        <p>{actionData.errors.newPassword[0]}</p>
      )}
      <button type="submit">Reset Password</button>
    </form>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) return redirect('/invalid-password-reset');

  try {
    await verifyPasswordResetToken(token);
  } catch {
    return redirect('/invalid-password-reset');
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const token = form.get('token') as string;
  const newPassword = form.get('newPassword') as string;

  const result = newPasswordSchema.safeParse({
    newPassword: newPassword,
  });

  if (!result.success) {
    return json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const verifiedToken = await verifyPasswordResetToken(token);
    await changeUserPassword(newPassword, verifiedToken.userId, token);
    return redirect('/login?reset=success');
  } catch {
    return redirect('/invalid-password-reset');
  }
}
