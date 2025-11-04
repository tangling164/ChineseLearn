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
  
  console.log('🔧 脚本数据库连接配置:');
  console.log('  - 使用 Pooler:', scriptUsesPooler ? '是' : '否');
  console.log('  - 连接字符串:', scriptConnectionString.replace(/:[^:@]+@/, ':***@').substring(0, 80) + '...');
  
  const scriptClient = postgres(scriptConnectionString, {
    prepare: !scriptUsesPooler,
    connect_timeout: 60, // 增加超时时间到 60 秒
    max: 1, // 脚本只用一个连接
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    ssl: 'require', // 明确指定 SSL
    connection: {
      application_name: 'type-cn-seed-script',
    },
  });

  return drizzle(scriptClient);
}
