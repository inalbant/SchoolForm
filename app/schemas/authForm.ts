import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  // .min(8, { message: "Be at least 8 characters long" })
  //   .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  //   .regex(/[0-9]/, { message: "Contain at least one number." })
  //   .regex(/[^a-zA-Z0-9]/, {
  //     message: "Contain at least one special character.",
  //   })
  //   .trim(),
});

export const signupSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Infer the types from the schemas
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;

export const newPasswordSchema = z.object({
  newPassword: loginSchema.shape.password,
});
