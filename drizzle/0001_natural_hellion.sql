CREATE TABLE `connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`connectedUserId` int NOT NULL,
	`status` enum('pending','accepted','declined','blocked') NOT NULL DEFAULT 'pending',
	`invitedBy` int NOT NULL,
	`shareSliderStates` boolean NOT NULL DEFAULT true,
	`shareDailyCycles` boolean NOT NULL DEFAULT false,
	`invitedAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `connections_unique` UNIQUE(`userId`,`connectedUserId`)
);
--> statement-breakpoint
CREATE TABLE `daily_cycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cycleDate` varchar(10) NOT NULL,
	`morningCompletedAt` timestamp,
	`decisivePrompt` text,
	`intendedAction` text,
	`middayCompletedAt` timestamp,
	`actionTaken` text,
	`observedEffect` text,
	`reflection` text,
	`eveningCompletedAt` timestamp,
	`isComplete` boolean NOT NULL DEFAULT false,
	`aiInsightId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_cycles_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_cycles_user_date_unique` UNIQUE(`userId`,`cycleDate`)
);
--> statement-breakpoint
CREATE TABLE `emotional_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`leftLabel` varchar(50) NOT NULL,
	`rightLabel` varchar(50) NOT NULL,
	`contextTag` varchar(50),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`color` varchar(7),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emotional_axes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('active','completed','dropped') NOT NULL DEFAULT 'active',
	`progressData` json,
	`completedAt` timestamp,
	CONSTRAINT `group_participants_id` PRIMARY KEY(`id`),
	CONSTRAINT `group_participants_unique` UNIQUE(`sessionId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `group_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`challengeType` varchar(50),
	`startDate` varchar(10) NOT NULL,
	`endDate` varchar(10) NOT NULL,
	`challengeParams` json,
	`isPrivate` boolean NOT NULL DEFAULT true,
	`maxParticipants` int,
	`status` enum('upcoming','active','completed','cancelled') NOT NULL DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `group_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`insightType` enum('daily','weekly','pattern','cause_effect') NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`startDate` varchar(10),
	`endDate` varchar(10),
	`patternData` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`userRating` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slider_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`axisId` int NOT NULL,
	`dailyCycleId` int,
	`value` int NOT NULL,
	`clientTimestamp` timestamp NOT NULL,
	`serverTimestamp` timestamp NOT NULL DEFAULT (now()),
	`calibrationType` enum('morning','midday','evening','manual') NOT NULL,
	`note` text,
	`syncStatus` enum('synced','pending','conflict') NOT NULL DEFAULT 'synced',
	`clientId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slider_states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` varchar(64) DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE `users` ADD `dailyReminderTime` varchar(5);--> statement-breakpoint
ALTER TABLE `connections` ADD CONSTRAINT `connections_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `connections` ADD CONSTRAINT `connections_connectedUserId_users_id_fk` FOREIGN KEY (`connectedUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `connections` ADD CONSTRAINT `connections_invitedBy_users_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `daily_cycles` ADD CONSTRAINT `daily_cycles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `daily_cycles` ADD CONSTRAINT `daily_cycles_aiInsightId_insights_id_fk` FOREIGN KEY (`aiInsightId`) REFERENCES `insights`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD CONSTRAINT `emotional_axes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_participants` ADD CONSTRAINT `group_participants_sessionId_group_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `group_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_participants` ADD CONSTRAINT `group_participants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_sessions` ADD CONSTRAINT `group_sessions_creatorId_users_id_fk` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `slider_states` ADD CONSTRAINT `slider_states_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `slider_states` ADD CONSTRAINT `slider_states_axisId_emotional_axes_id_fk` FOREIGN KEY (`axisId`) REFERENCES `emotional_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `slider_states` ADD CONSTRAINT `slider_states_dailyCycleId_daily_cycles_id_fk` FOREIGN KEY (`dailyCycleId`) REFERENCES `daily_cycles`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `connections_user_id_idx` ON `connections` (`userId`);--> statement-breakpoint
CREATE INDEX `connections_connected_user_id_idx` ON `connections` (`connectedUserId`);--> statement-breakpoint
CREATE INDEX `connections_status_idx` ON `connections` (`status`);--> statement-breakpoint
CREATE INDEX `daily_cycles_user_id_idx` ON `daily_cycles` (`userId`);--> statement-breakpoint
CREATE INDEX `daily_cycles_cycle_date_idx` ON `daily_cycles` (`cycleDate`);--> statement-breakpoint
CREATE INDEX `emotional_axes_user_id_idx` ON `emotional_axes` (`userId`);--> statement-breakpoint
CREATE INDEX `group_participants_session_id_idx` ON `group_participants` (`sessionId`);--> statement-breakpoint
CREATE INDEX `group_participants_user_id_idx` ON `group_participants` (`userId`);--> statement-breakpoint
CREATE INDEX `group_sessions_creator_id_idx` ON `group_sessions` (`creatorId`);--> statement-breakpoint
CREATE INDEX `group_sessions_status_idx` ON `group_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `group_sessions_start_date_idx` ON `group_sessions` (`startDate`);--> statement-breakpoint
CREATE INDEX `insights_user_id_idx` ON `insights` (`userId`);--> statement-breakpoint
CREATE INDEX `insights_insight_type_idx` ON `insights` (`insightType`);--> statement-breakpoint
CREATE INDEX `insights_created_at_idx` ON `insights` (`createdAt`);--> statement-breakpoint
CREATE INDEX `slider_states_user_id_idx` ON `slider_states` (`userId`);--> statement-breakpoint
CREATE INDEX `slider_states_axis_id_idx` ON `slider_states` (`axisId`);--> statement-breakpoint
CREATE INDEX `slider_states_daily_cycle_id_idx` ON `slider_states` (`dailyCycleId`);--> statement-breakpoint
CREATE INDEX `slider_states_client_timestamp_idx` ON `slider_states` (`clientTimestamp`);