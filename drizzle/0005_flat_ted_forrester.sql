ALTER TABLE `daily_cycles` ADD `completedViaGracePeriod` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `daily_cycles` ADD `gracePeriodUsedAt` timestamp;