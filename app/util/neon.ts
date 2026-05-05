import { Client } from '@neondatabase/serverless';

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

  // `@neondatabase/serverless` works reliably with Neon DB URLs.
  // Hyperdrive URLs use a different transport and should be handled by dedicated drivers.
  return workerDatabaseUrl ?? envDatabaseUrl ?? hyperdriveConnectionString;
}

export async function getNeonClient(context?: LoaderContext) {
  const connectionString = resolveConnectionString(context);
  if (!connectionString) {
    throw new Error('DATABASE_URL or HYPERDRIVE.connectionString is required');
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const { rows } = await client.query('SELECT 1 as connected');
    return rows[0];
  } finally {
    await client.end();
  }
}
