import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolveDatabaseConnection } from "./lib/db/connection-string";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const { connectionString } = resolveDatabaseConnection("migrations");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
