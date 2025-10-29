import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config as loadEnv } from "dotenv";
import { resolveDatabaseConnection } from "./connection-string";

// Ensure local `.env` files populate process.env when running scripts or tests.
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const { connectionString, usesSupabasePooler } = resolveDatabaseConnection("runtime");

const client = postgres(connectionString, {
  // Prepared statements are incompatible with Supabase's transaction pooler.
  prepare: !usesSupabasePooler,
});

export const db = drizzle(client);
export type Database = typeof db;
