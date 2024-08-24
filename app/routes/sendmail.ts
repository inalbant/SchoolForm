import { json } from '@remix-run/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const loader = async () => {
  const { data, error } = await resend.emails.send({
    from: 'SchoolForm <no-reply@schoolform.co>',
    to: ['ibs137@gmail.com'],
    subject: 'Hello world',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return json({ error }, 400);
  }

  return json(data, 200);
};
