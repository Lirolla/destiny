CREATE TABLE `highlight_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sharedHighlightId` int NOT NULL,
	`content` text NOT NULL,
	`parentCommentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `highlight_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `highlight_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sharedHighlightId` int NOT NULL,
	`reactionType` varchar(20) NOT NULL DEFAULT 'like',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `highlight_reactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_highlights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`highlightId` int NOT NULL,
	`selectedText` text NOT NULL,
	`note` text,
	`color` varchar(20),
	`pageNumber` int,
	`chapterTitle` varchar(255),
	`isPublic` boolean NOT NULL DEFAULT true,
	`likesCount` int NOT NULL DEFAULT 0,
	`commentsCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shared_highlights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `highlight_comments_user_id_idx` ON `highlight_comments` (`userId`);--> statement-breakpoint
CREATE INDEX `highlight_comments_shared_highlight_id_idx` ON `highlight_comments` (`sharedHighlightId`);--> statement-breakpoint
CREATE INDEX `highlight_comments_parent_comment_id_idx` ON `highlight_comments` (`parentCommentId`);--> statement-breakpoint
CREATE INDEX `highlight_reactions_user_id_idx` ON `highlight_reactions` (`userId`);--> statement-breakpoint
CREATE INDEX `highlight_reactions_shared_highlight_id_idx` ON `highlight_reactions` (`sharedHighlightId`);--> statement-breakpoint
CREATE INDEX `highlight_reactions_unique` ON `highlight_reactions` (`userId`,`sharedHighlightId`,`reactionType`);--> statement-breakpoint
CREATE INDEX `shared_highlights_user_id_idx` ON `shared_highlights` (`userId`);--> statement-breakpoint
CREATE INDEX `shared_highlights_highlight_id_idx` ON `shared_highlights` (`highlightId`);--> statement-breakpoint
CREATE INDEX `shared_highlights_is_public_idx` ON `shared_highlights` (`isPublic`);--> statement-breakpoint
CREATE INDEX `shared_highlights_created_at_idx` ON `shared_highlights` (`createdAt`);