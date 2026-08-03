CREATE TABLE `extension_info` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`author` text NOT NULL,
	`description` text,
	`enabled` integer DEFAULT true NOT NULL,
	`main` text
);
--> statement-breakpoint
CREATE TABLE `extension_storage` (
	`extensionId` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updatedAt` integer NOT NULL,
	PRIMARY KEY(`extensionId`, `key`)
);
--> statement-breakpoint
CREATE TABLE `schedule_tags` (
	`scheduleId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`scheduleId`, `tagId`),
	FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text,
	`startDate` integer NOT NULL,
	`endDate` integer NOT NULL,
	`isAllDay` integer DEFAULT false NOT NULL,
	`recurringRule` text,
	`colorLabel` text DEFAULT '#E1E1E1' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);