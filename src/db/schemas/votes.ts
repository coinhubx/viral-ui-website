import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { components } from "./components";
import { users } from "./users";

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
