CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('first_calibration','streak_7','streak_30','streak_100','first_module','modules_5','modules_all','calibrations_100','calibrations_500','calibrations_1000','first_cycle','cycles_30','cycles_100','first_insight','insights_50','first_connection','connections_10','first_challenge','challenges_5') NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`notified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `achievements_user_id_idx` ON `achievements` (`userId`);--> statement-breakpoint
CREATE INDEX `achievements_badge_type_idx` ON `achievements` (`badgeType`);--> statement-breakpoint
CREATE INDEX `achievements_unique_user_badge` ON `achievements` (`userId`,`badgeType`);