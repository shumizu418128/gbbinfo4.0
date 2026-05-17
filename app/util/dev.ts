export type AppEnv = "dev" | "preview" | "production";

/** Netlify / Node 上でのみ process.env を参照する。ブラウザでは import.meta.env にフォールバックする。 */
export const envCheck = (): AppEnv => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NETLIFY_PREVIEW_SERVER === "true") {
      return "preview";
    }
    if (process.env.NETLIFY === "true") {
      return "production";
    }
  }
  if (import.meta.env.DEV) {
    return "dev";
  }
  return "production";
};
