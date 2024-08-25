import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import {
  passwordResetTokens,
  type SelectUser,
  users,
  verifyEmailTokens,
} from 'db/schema';
import { db } from 'db';
import { sessionStorage } from '~/services/session.server';
import {
  APP_NAME,
  argon2Config,
  TOKEN_LENGTH,
  TOKEN_TTL,
} from '~/lib/constants';
import type { AppLoadContext } from '@remix-run/node';
import { generateRandomToken } from '~/lib/utils';
import { sendEmail } from '~/lib/email';
import { VerifyEmail } from '~/emails/verify-email';
import { ResetPasswordEmail } from '~/emails/password-reset-email';

export const authenticator = new Authenticator<
  Omit<SelectUser, 'passwordHash'>
>(sessionStorage, { throwOnError: true });

interface AuthContext extends AppLoadContext {
  user?: Omit<SelectUser, 'passwordHash'>;
}

authenticator.use(
  new FormStrategy(
    async ({ form, context }: { form: FormData; context?: AuthContext }) => {
      // if user is already present, don't try to login
      if (context?.user) {
        return {
          id: context.user.id,
          email: context.user.email,
          emailVerified: context.user.emailVerified,
        };
      }

      const email = form.get('email') as string;
      const password = form.get('password') as string;

      const user = await login(email, password);

      if (!user) throw new AuthorizationError('Invalid email or password');

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      };
    }
  ),
  'user-pass'
);

async function login(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) return null;

  const validPassword = await verify(user.passwordHash, password, argon2Config);

  if (!validPassword) return null;

  return user;
}

export async function createUser(email: string, password: string) {
  const passwordHash = await hash(password, argon2Config);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  const token = await createEmailVerificationToken(user.id);

  await sendEmail(
    email,
    `Verify your email for ${APP_NAME}`,
    <VerifyEmail token={token} />
  );

  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

async function createEmailVerificationToken(userId: number) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db
    .insert(verifyEmailTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: verifyEmailTokens.userId,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}

export async function verifyEmailToken(token: string) {
  const existingToken = await db.query.verifyEmailTokens.findFirst({
    where: eq(verifyEmailTokens.token, token),
  });

  const currentTime = Date.now();

  if (!existingToken || Number(existingToken.tokenExpiresAt) < currentTime)
    throw new AuthorizationError('Invalid token or token timed out');

  const userId = existingToken.userId;

  const [user] = await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  await db.delete(verifyEmailTokens).where(eq(verifyEmailTokens.token, token));

  return user;
}

export async function sendPasswordResetEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) return;

  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  await sendEmail(
    email,
    `Reset your password for ${APP_NAME}`,
    <ResetPasswordEmail token={token} />
  );
}

export async function verifyPasswordResetToken(token: string) {
  const existingToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.token, token),
  });

  const currentTime = Date.now();

  if (!existingToken || Number(existingToken.tokenExpiresAt) < currentTime)
    throw new Error('Invalid token or token timed out');

  return existingToken;
}

export async function changeUserPassword(
  newPassword: string,
  userId: number,
  token: string
) {
  const passwordHash = await hash(newPassword, argon2Config);

  await db
    .update(users)
    .set({
      passwordHash,
    })
    .where(eq(users.id, userId));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token));
}
