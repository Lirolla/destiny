ALTER TABLE `emotional_axes` ADD `axisNumber` int NOT NULL;--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `axisName` varchar(100);--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `subtitle` varchar(200);--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `emoji` varchar(10);--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `colorLow` varchar(7);--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `colorHigh` varchar(7);--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `reflectionPrompt` text;--> statement-breakpoint
ALTER TABLE `emotional_axes` ADD `chapterRef` varchar(200);