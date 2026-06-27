export type AppEnv = "production" | "preview" | "dev";

export const envCheck = (): AppEnv => {
  return process.env.DEPLOY_ENV as AppEnv;
};
