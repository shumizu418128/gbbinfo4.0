import { Client } from '@neondatabase/serverless';

export async function getNeonClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const { rows } = await client.query('SELECT 1 as connected');
  return Response.json({ success: true, result: rows[0] });
}
