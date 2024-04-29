"use server";

import db from "@/db";
import { users } from "@/db/schemas/users";
import { getSupabaseAuth, getUser } from "@/lib/auth";
import { PackageManager } from "@/lib/types";
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
      options: {
        emailRedirectTo: "https://viralui.com/login",
      },
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

export const updateProfileAction = async (formData: FormData) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to update profile");

    const avatarUrl = formData.get("avatarUrl") as string;
    const packageManager = formData.get("packageManager") as PackageManager;
    const xUrl = formData.get("xUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;

    let data = {
      avatarUrl,
      packageManager,
      xUrl,
      githubUrl,
      youtubeUrl,
    };

    await db.update(users).set(data).where(eq(users.id, user.id));
    // this code triggers a revalidation of the user data
    await getSupabaseAuth().updateUser({});

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
