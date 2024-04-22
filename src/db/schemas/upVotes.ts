import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { components } from "./components";
import { users } from "./users";

export const upVotes = pgTable("up_votes", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id")
    .references(() => components.id)
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UpVotes = typeof upVotes.$inferSelect;
