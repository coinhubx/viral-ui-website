import { DBUser } from "@/db/schemas/users";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type User = Omit<SupabaseUser, "user_metadata"> & DBUser;
