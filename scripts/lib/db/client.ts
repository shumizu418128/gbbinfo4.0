import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  participantMemberTable,
  participantTable,
  tavilyTable,
} from "./schema.ts";

const schema = {
  participantTable,
  participantMemberTable,
  tavilyTable,
};

type ScriptDbSchema = typeof schema;

let client: ReturnType<typeof postgres> | null = null;
let db: PostgresJsDatabase<ScriptDbSchema> | null = null;

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

export const getDb = (): PostgresJsDatabase<ScriptDbSchema> => {
  if (!db) {
    db = drizzle(getClient(), { schema });
  }
  return db;
};
