import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const packageManagerEnum = pgEnum("package_manager", [
  "pnpm",
  "npm",
  "yarn",
  "bun",
]);

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  fileName: text("file_name").notNull(),
  score: integer("score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id")
    .references(() => components.id)
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  vote: integer("vote").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vote = typeof votes.$inferSelect;
export type DBUser = typeof users.$inferSelect;
export type Component = typeof components.$inferSelect;
