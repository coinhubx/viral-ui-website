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

export const upVoteAction = async (
  componentId: number,
  currentVote: number,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const newVote = 1;

    const insertVote = async () => {
      await db
        .insert(votes)
        .values({ userId: user.id, componentId, vote: newVote });
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
        .set({ vote: newVote, createdAt: new Date() })
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    };

    let change = 0;

    // Haven't voted yet
    if (currentVote === 0) {
      change = 1;
      await insertVote();
    }
    // Already up-voted
    else if (currentVote === 1) {
      change = -1;
      await deleteVote();
    }
    // Already down-voted
    else if (currentVote === -1) {
      change = 2;
      await replaceVote();
    }

    await db
      .update(components)
      .set({ score: sql`${components.score} + ${change}` })
      .where(eq(components.id, componentId));

    revalidateTag(componentId.toString());

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const downVoteAction = async (
  componentId: number,
  currentVote: number,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const newVote = -1;

    const insertVote = async () => {
      await db
        .insert(votes)
        .values({ userId: user.id, componentId, vote: newVote });
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
        .set({ vote: newVote, createdAt: new Date() })
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
    };

    let change = 0;

    // Haven't voted yet
    if (currentVote === 0) {
      change = -1;
      await insertVote();
    }
    // Already up-voted
    else if (currentVote === 1) {
      change = -2;
      await replaceVote();
    }
    // Already down-voted
    else if (currentVote === -1) {
      change = 1;
      await deleteVote();
    }

    await db
      .update(components)
      .set({ score: sql`${components.score} + ${change}` })
      .where(eq(components.id, componentId));

    revalidateTag(componentId.toString());

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
