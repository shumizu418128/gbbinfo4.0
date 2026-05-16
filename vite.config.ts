import { paraglideVitePlugin } from '@inlang/paraglide-js'
import netlify from "@netlify/vite-plugin";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './paraglide',
      strategy: ['url', "preferredLanguage", "baseLocale"]
    }),
    tailwindcss(),
    reactRouter(),
    netlifyReactRouter(),
    netlify(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
