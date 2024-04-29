import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const packageManagerEnum = pgEnum("package_manager", [
  "pnpm",
  "npm",
  "yarn",
  "bun",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  packageManager: packageManagerEnum("package_manager")
    .default("pnpm")
    .notNull(),
  xUrl: text("x_url"),
  githubUrl: text("github_url"),
  youtubeUrl: text("youtube_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DBUser = typeof users.$inferSelect;
