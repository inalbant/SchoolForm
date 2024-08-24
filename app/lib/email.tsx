import type { ReactNode } from 'react';
import { Resend } from 'resend';
import { APP_NAME } from './constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: ReactNode) {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <no-reply@schoolform.co>`,
    to,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}
