import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import { sendPasswordResetEmail } from '~/services/auth.server';

export default function ForgotPassword() {
  const navigation = useNavigation();

  return (
    <Form method="post">
      <fieldset disabled={navigation.state === 'submitting'}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required />
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = form.get('email') as string;

  await sendPasswordResetEmail(email);

  return redirect('/forgot-password-confirmation');
}
