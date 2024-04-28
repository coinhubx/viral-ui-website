"use server";

import db from "@/db";
import { components } from "@/db/schemas/components";
import { votes } from "@/db/schemas/votes";
import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";

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

export const upVoteAction = async (componentId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const [{ vote: currentVote }] = await db
      .select()
      .from(votes)
      .where(
        and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
      );

    let change = 0;

    // haven't voted yet
    if (currentVote === 0) {
      change = 1;
      // insert vote
      await db.insert(votes).values({ userId: user.id, componentId, vote: 1 });
    }
    // already up-voted
    else if (currentVote === 1) {
      change = -1;
      // delete vote
      await db
        .delete(votes)
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    }
    // already down-voted
    else if (currentVote === -1) {
      change = 2;
      // replace vote
      await db
        .update(votes)
        .set({ vote: 1, createdAt: new Date() })
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
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

export const downVoteAction = async (componentId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const [{ vote: currentVote }] = await db
      .select()
      .from(votes)
      .where(
        and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
      );

    let change = 0;

    // haven't voted yet
    if (currentVote === 0) {
      change = -1;
      // insert vote
      await db.insert(votes).values({ userId: user.id, componentId, vote: -1 });
    }
    // already up-voted
    else if (currentVote === 1) {
      change = -2;
      // replace vote
      await db
        .update(votes)
        .set({ vote: -1, createdAt: new Date() })
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    }
    // already down-voted
    else if (currentVote === -1) {
      change = 1;
      // delete vote
      await db
        .delete(votes)
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
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
