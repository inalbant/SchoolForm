import { json, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authenticator, verifyEmailToken } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) return redirect('/login');

  try {
    const user = await verifyEmailToken(token);

    const session = await getSession();

    session.set(authenticator.sessionKey, {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    // Commit the session to get the Set-Cookie header
    const cookie = await commitSession(session);

    // Redirect to the dashboard with the session cookie set
    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (error) {
    console.log('*** error is: ', error);

    return json({ error: 'Error verifying email' }, { status: 400 });
  }
}
