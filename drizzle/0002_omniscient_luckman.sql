ALTER TABLE `users` ADD `notificationsEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `pushSubscription` json;