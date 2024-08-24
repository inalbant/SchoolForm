import {
  index,
  integer,
  sqliteTableCreator,
  text,
} from 'drizzle-orm/sqlite-core';

const sqliteTable = sqliteTableCreator((name) => `schoolform_${name}`);

export const users = sqliteTable(
  'user',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    email: text('email').unique().notNull(),
    emailVerified: integer('email_verified', { mode: 'timestamp' }),
    passwordHash: text('password_hash').notNull(),
  },
  (table) => ({
    emailIdx: index('user_email_idx').on(table.email),
  })
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id', { mode: 'number' })
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  expiresAt: integer('expires_at').notNull(),
});

export const passwordResetTokens = sqliteTable('reset_tokens', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  token: text('token'),
  tokenExpiresAt: integer('token_expires_at', { mode: 'timestamp' }).notNull(),
});

export const verifyEmailTokens = sqliteTable('verify_email_tokens', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  token: text('token'),
  tokenExpiresAt: integer('token_expires_at', { mode: 'timestamp' }).notNull(),
});
