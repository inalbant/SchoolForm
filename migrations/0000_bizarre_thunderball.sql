CREATE TABLE `schoolform_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `schoolform_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schoolform_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `schoolform_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schoolform_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`email_verified` integer
);
--> statement-breakpoint
CREATE TABLE `schoolform_verify_email_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `schoolform_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `schoolform_reset_tokens_user_id_unique` ON `schoolform_reset_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `schoolform_user_email_unique` ON `schoolform_user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `schoolform_verify_email_tokens_user_id_unique` ON `schoolform_verify_email_tokens` (`user_id`);