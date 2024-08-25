# SchoolForm

The modern web app for schools of all types to manage their students.
The tech stack is:

- TypeScript
- React, Remix, Vite
- Tailwind CSS
- Drizzle ORM
- Turso DB
- Resend Email
- Stripe

## Features
Completed:

- User registration flow using email and password
- Sending and verifying emails
- User login
- Password reset

To do:

- Landing page
- Rate limiting
- User profiles
- Authorization
- Dashboard
- Invite users
- Db tables for schools, students, admins, and staff
- Payment

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
