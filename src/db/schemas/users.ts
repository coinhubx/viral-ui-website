import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  xUrl: text("x_url"),
  githubUrl: text("github_url"),
  youtubeUrl: text("youtube_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DBUser = typeof users.$inferSelect;
