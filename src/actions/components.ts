"use server";

import { getUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";

export const submitComponentAction = async (formData: FormData) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to add component");

    const componentText = formData.get("componentText") as string;
    const fileName = formData.get("fileName") as string;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
