import { Client } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { yearTable, type Year } from './type.js';

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

function resolveConnectionString(context?: LoaderContext): string | undefined {
  const envDatabaseUrl = process.env.DATABASE_URL;
  const workerDatabaseUrl = context?.cloudflare?.env?.DATABASE_URL;
  const hyperdriveConnectionString = context?.cloudflare?.env?.HYPERDRIVE?.connectionString;

  const connectionString = workerDatabaseUrl ?? envDatabaseUrl ?? hyperdriveConnectionString;
  if (!connectionString) {
    throw new Error('DATABASE_URL or HYPERDRIVE.connectionString is required');
  }
  return connectionString;
}

export async function neonTest(context?: LoaderContext): Promise<{ connected: number }> {
  const connectionString = resolveConnectionString(context);
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const { rows } = await client.query('SELECT 1 as connected');
    return rows[0];
  } finally {
    await client.end();
  }
}

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
