import { createRequestHandler } from "@react-router/cloudflare";

type WorkerExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
};

type Env = {
  HYPERDRIVE?: {
    connectionString: string;
  };
  DATABASE_URL?: string;
};

const handleRequest = createRequestHandler({
  build: () => import("../build/server/index.js") as Promise<any>,
  mode: "production",
});

export default {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    return handleRequest({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
      params: {},
      data: {},
      functionPath: "",
      next: async () => new Response("Not Found", { status: 404 }),
    });
  },
};
