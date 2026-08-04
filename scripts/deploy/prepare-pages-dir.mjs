import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Cloudflare Pages デプロイ用ディレクトリを組み立てる。
 *
 * `cloudflare/public`（画像・_headers）に `dist/_astro`（Astro ハッシュ付き JS/CSS）を合成し、
 * `cloudflare/dist-pages` へ出力する。Pages はデプロイ単位で全置換のため、
 * 画像だけデプロイすると `_astro` が消えるので、常に両方を含める。
 */
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicDir = path.join(rootDir, "cloudflare", "public");
const astroDir = path.join(rootDir, "dist", "_astro");
const outDir = path.join(rootDir, "cloudflare", "dist-pages");

const pathExists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  if (!(await pathExists(publicDir))) {
    throw new Error(`Missing ${publicDir}`);
  }

  const hasAstro = await pathExists(astroDir);
  if (!hasAstro) {
    throw new Error(
      `Missing ${astroDir}. Run a production build (or Docker --target export) before assets:prepare.`,
    );
  }

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await fs.cp(publicDir, outDir, { recursive: true });
  await fs.cp(astroDir, path.join(outDir, "_astro"), { recursive: true });

  const astroFiles = await fs.readdir(path.join(outDir, "_astro"));
  console.log(
    `Prepared ${outDir} (public + _astro, ${astroFiles.length} asset files)`,
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
