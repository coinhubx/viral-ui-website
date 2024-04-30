import { DBUser } from "@/db/schema";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type User = Omit<SupabaseUser, "user_metadata"> & DBUser;

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
