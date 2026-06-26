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
