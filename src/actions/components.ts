"use server";

import db from "@/db";
import { components } from "@/db/schemas/components";
import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";

export const submitComponentAction = async (formData: FormData) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to add component");

    const content = formData.get("content") as string;
    const fileName = formData.get("fileName") as string;

    await db.insert(components).values({ userId: user.id, content, fileName });

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
