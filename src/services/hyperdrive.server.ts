export interface HyperdriveBinding {
  connectionString: string;
}

export interface ServerEnv {
  HYPERDRIVE?: HyperdriveBinding;
  DATABASE_URL?: string;
}

export function resolveDatabaseConnection(env?: ServerEnv): string {
  if (env?.HYPERDRIVE?.connectionString) {
    return env.HYPERDRIVE.connectionString;
  }

  if (env?.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  throw new Error("Hyperdrive connection is required. Set HYPERDRIVE or DATABASE_URL.");
}
