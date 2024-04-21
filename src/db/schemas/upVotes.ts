import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { components } from "./components";
import { users } from "./users";

export const upVotes = pgTable("up_votes", {
  id: serial("id").primaryKey(),
  componentId: text("component_id").references(() => components.id),
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UpVotes = typeof upVotes.$inferSelect;
