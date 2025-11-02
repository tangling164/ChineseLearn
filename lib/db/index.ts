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
  // 增加连接超时时间（秒）
  connect_timeout: 10,
});

export const db = drizzle(client);
export type Database = typeof db;

// 用于脚本（seed, push 等）的数据库连接，使用直接连接
export function getDatabaseForScripts() {
  const { connectionString: scriptConnectionString, usesSupabasePooler: scriptUsesPooler } = 
    resolveDatabaseConnection("migrations");
  
  const scriptClient = postgres(scriptConnectionString, {
    prepare: !scriptUsesPooler,
    connect_timeout: 30, // 脚本可能需要更长的超时时间
    max: 1, // 脚本只用一个连接
  });

  return drizzle(scriptClient);
}
