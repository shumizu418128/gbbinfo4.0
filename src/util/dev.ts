export type AppEnv = "production" | "preview" | "dev";

export type NonProductionEnv = Exclude<AppEnv, "production">;

export const envBannerColors: Record<NonProductionEnv, string> = {
  dev: "bg-red-600",
  preview: "bg-blue-600",
};

export const envCheck = (): AppEnv => {
  return process.env.DEPLOY_ENV as AppEnv;
};
