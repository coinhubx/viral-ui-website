"use server";

import db from "@/db";
import { components } from "@/db/schemas/components";
import { votes } from "@/db/schemas/votes";
import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";

export const submitComponentAction = async (
  content: string,
  fileName: string,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to add a component");

    await db.insert(components).values({ userId: user.id, content, fileName });

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const voteAction = async (
  direction: "up" | "down",
  componentId: number,
  currentVote: number,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const vote = direction === "up" ? 1 : -1;

    const insertVote = async () => {
      await db.insert(votes).values({ userId: user.id, componentId, vote });
    };

    const deleteVote = async () => {
      await db
        .delete(votes)
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    };

    const replaceVote = async () => {
      await db
        .update(votes)
        .set({ vote, createdAt: new Date() })
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    };

    let change = 0;

    // Haven't voted yet
    if (currentVote === 0) {
      if (direction === "up") {
        change = 1;
      } else if (direction === "down") {
        change = -1;
      }
      await insertVote();
    }
    // Already up-voted
    else if (currentVote === 1) {
      if (direction === "up") {
        change = -1;
        await deleteVote();
      } else if (direction === "down") {
        change = -2;
        await replaceVote();
      }
    }
    // Already down-voted
    else if (currentVote === -1) {
      if (direction === "up") {
        change = 2;
        await replaceVote();
      } else if (direction === "down") {
        change = 1;
        await deleteVote();
      }
    }

    await db
      .update(components)
      .set({ score: sql`${components.score} + ${change}` })
      .where(eq(components.id, componentId));

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
