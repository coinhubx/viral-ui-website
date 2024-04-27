"use server";

import db from "@/db";
import { components } from "@/db/schemas/components";
import { votes } from "@/db/schemas/votes";
import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { and, eq } from "drizzle-orm";

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

export const voteAction = async (value: "up" | "down", componentId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to vote");

    const change = value === "up" ? 1 : -1;

    const _votes = await db
      .select()
      .from(votes)
      .where(
        and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
      );

    if (_votes.length) {
      await db
        .delete(votes)
        .where(
          and(eq(votes.userId, user.id), eq(votes.componentId, componentId)),
        );
      if (_votes[0].vote !== change) {
        await db
          .insert(votes)
          .values({ userId: user.id, componentId, vote: change });
      }
    } else {
      await db
        .insert(votes)
        .values({ userId: user.id, componentId, vote: change });
    }

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
