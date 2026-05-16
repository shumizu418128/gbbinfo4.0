import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { yearTable, type Year } from './type.js';

const { Client } = pg;

type LoaderContext = {
  cloudflare?: {
    env?: {
      DATABASE_URL?: string;
      HYPERDRIVE?: {
        connectionString: string;
      };
    };
  };
};

const resolveConnectionString = (context?: LoaderContext): string => {
  const hyperdriveConnectionString = context?.cloudflare?.env?.HYPERDRIVE?.connectionString;
  const workerDatabaseUrl = context?.cloudflare?.env?.DATABASE_URL;
  const envDatabaseUrl = process.env.DATABASE_URL;

  const connectionString =
    hyperdriveConnectionString ?? workerDatabaseUrl ?? envDatabaseUrl;
  if (!connectionString) {
    throw new Error('HYPERDRIVE.connectionString or DATABASE_URL is required');
  }
  return connectionString;
};

export const neonTest = async (
  context?: LoaderContext
): Promise<{ connected: number }> => {
  const connectionString = resolveConnectionString(context);
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const { rows } = await client.query<{ connected: number }>('SELECT 1 AS connected');
    const row = rows[0];
    if (!row) {
      throw new Error('Database connection test returned no rows');
    }
    return row;
  } finally {
    await client.end();
  }
};

export const getYearInfo = async (
  year: number,
  context?: LoaderContext
): Promise<Year> => {
  const connectionString = resolveConnectionString(context);
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const db = drizzle(client);
    const rows = await db
      .select()
      .from(yearTable)
      .where(eq(yearTable.year, year))
      .limit(1);
    const row = rows[0];
    if (!row) {
      throw new Error(`Year not found: ${year}`);
    }
    return row;
  } finally {
    await client.end();
  }
};
