export type AppEnv = "production" | "deploy-preview" | "branch-deploy" | "dev";

export const envCheck = (): AppEnv => {
  return process.env.CONTEXT as AppEnv;
};
