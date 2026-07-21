import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema, type Schema } from "./relations.js";

let client: ReturnType<typeof postgres> | null = null;
let db: PostgresJsDatabase<Schema> | null = null;

const getClient = () => {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required");
    }
    client = postgres(connectionString, {
      prepare: false,
      ssl: "require",
      connect_timeout: 30,
      max: 4,
    });
  }
  return client;
};

export const getDb = (): PostgresJsDatabase<Schema> => {
  if (!db) {
    db = drizzle(getClient(), { schema });
  }
  return db;
};

/** スクリプト終了時に接続プールを閉じる（未呼び出しだと process が残る） */
export const closeDb = async (): Promise<void> => {
  if (client) {
    await client.end({ timeout: 5 });
    client = null;
    db = null;
  }
};
