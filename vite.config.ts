import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [paraglideVitePlugin({
    project: './project.inlang',
    outdir: './paraglide',
    strategy: ['url', "preferredLanguage", "baseLocale"]
  }), tailwindcss(), reactRouter(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
  resolve: {
    tsconfigPaths: true,
  },
});