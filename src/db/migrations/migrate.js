import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pushMigration = async () => {
  const migrationClient = postgres(process.env.DB_CONNECTION_STRING, {
    max: 1,
  });
  const migrationDb = drizzle(migrationClient);

  await migrate(migrationDb, {
    migrationsFolder: "./src/db/migrations/drizzle",
  });
  await migrationClient.end();
};

pushMigration();
