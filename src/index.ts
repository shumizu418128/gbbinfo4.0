type Env = {
  HYPERDRIVE?: {
    connectionString: string;
  };
};

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    const hasHyperdrive = Boolean(env.HYPERDRIVE?.connectionString);

    return Response.json({
      ok: true,
      runtime: "cloudflare-worker",
      hasHyperdrive,
    });
  },
};
