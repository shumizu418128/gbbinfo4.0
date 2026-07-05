import type { AppEnv } from "../util/dev.js";

type DevProps = {
  env: AppEnv;
};

const envColors: Record<string, string> = {
  "dev": "bg-red-600",
  "preview": "bg-blue-600",
}

export const Dev = ({ env }: DevProps) => {
  if (env === "production") {
    return null;
  }

  const color = envColors[env];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 z-50 flex h-5 w-full items-center justify-center text-xs font-bold text-white ${color}`}
    >
      {env}
    </div>
  );
};
