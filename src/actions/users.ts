"use server";

import db from "@/db";
import { users } from "@/db/schemas/users";
import { getSupabaseAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const createAccountAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const usernameTaken = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (usernameTaken.length) {
      throw new Error("This username is already taken");
    }

    const { error, data } = await getSupabaseAuth().signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      const { id, email } = data.user;
      await db.insert(users).values({ id, email: email as string, username });
    } else {
      throw new Error("Error creating user");
    }

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const loginAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: loginError } =
      await getSupabaseAuth().signInWithPassword({
        email,
        password,
      });
    if (loginError) throw loginError;
    if (!data.session) throw new Error("No session");

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const signOutAction = async () => {
  try {
    const { error } = await getSupabaseAuth().signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
