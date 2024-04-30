import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DB_CONNECTION_STRING as string);
const db = drizzle(client, { schema });

export default db;
