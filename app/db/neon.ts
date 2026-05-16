import { eq } from 'drizzle-orm';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { yearTable, type Year } from './type.js';

const { Client } = pg;

let client: pg.Client | null = null;
let db: NodePgDatabase | null = null;

const resolveConnectionString = (): string => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }
  return connectionString;
};

const getClient = async (): Promise<pg.Client> => {
  if (!client) {
    client = new Client({ connectionString: resolveConnectionString() });
    await client.connect();
  }
  return client;
};

const getDb = async (): Promise<NodePgDatabase> => {
  if (!db) {
    db = drizzle(await getClient());
  }
  return db;
};

export const neonTest = async (): Promise<{ connected: number }> => {
  const pgClient = await getClient();
  const { rows } = await pgClient.query<{ connected: number }>('SELECT 1 AS connected');
  const row = rows[0];
  if (!row) {
    throw new Error('Database connection test returned no rows');
  }
  return row;
};

export const getYearInfo = async (year: number): Promise<Year> => {
  const database = await getDb();
  const rows = await database
    .select()
    .from(yearTable)
    .where(eq(yearTable.year, year))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new Error(`Year not found: ${year}`);
  }
  return row;
};
