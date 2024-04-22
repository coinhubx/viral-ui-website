"use server";

import db from "@/db";
import { components } from "@/db/schemas/components";
import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";

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
