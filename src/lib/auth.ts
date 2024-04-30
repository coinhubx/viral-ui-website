import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import db from "@/db";
import { eq } from "drizzle-orm";
import { User } from "./types";
import { users } from "@/db/schema";

export const getUser = async () => {
  const auth = getSupabaseAuth();
  const authUser = (await auth.getUser()).data.user;
  if (!authUser) return null;

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id));

  const user: User = {
    ...authUser,
    email: dbUser.email,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    packageManager: dbUser.packageManager,
    xUrl: dbUser.xUrl,
    githubUrl: dbUser.githubUrl,
    youtubeUrl: dbUser.youtubeUrl,
    createdAt: dbUser.createdAt,
  };

  return user;
};

export const getSupabaseAuth = () => {
  const cookieStore = cookies();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
    },
  );

  return supabaseClient.auth;
};
