/*
 * src/pages から検索用ハブカタログを生成し vercel/data/page-catalog.json へ書く。
 * 出場者詳細ページは含めない。
 *
 * Usage:
 *   npm run sync:search-catalog
 */

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PageCatalog = {
  years: number[];
  yearSections: Record<string, string[]>;
};

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const langPagesDir = path.join(repoRoot, "src", "pages", "[lang]");
const outputPath = path.join(repoRoot, "vercel", "data", "page-catalog.json");

const listNames = (dir: string): string[] => {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
};

const yearFromDir = (name: string): number | null => {
  if (!/^\d{4}$/.test(name)) {
    return null;
  }
  return Number(name);
};

/**
 * 年度ディレクトリからハブ slug を集める。
 *
 * Args:
 *   yearDir: `src/pages/[lang]/{year}`。
 *
 * Returns:
 *   top / timetable / participants などの slug。
 */
const collectYearSections = (yearDir: string): string[] => {
  const sections = new Set<string>();
  for (const name of listNames(yearDir)) {
    if (name.endsWith(".astro")) {
      const slug = name.replace(/\.astro$/, "");
      if (slug !== "wildcard_regulation" && slug !== "studio_competition") {
        sections.add(slug);
      }
      continue;
    }
    if (name === "participants" || name === "result") {
      sections.add(name);
    }
  }
  return [...sections].sort();
};

const main = (): void => {
  const yearSections: Record<string, string[]> = {};
  const years: number[] = [];

  for (const name of listNames(langPagesDir)) {
    const year = yearFromDir(name);
    if (year === null) {
      continue;
    }
    years.push(year);
    yearSections[name] = collectYearSections(path.join(langPagesDir, name));
  }

  years.sort((a, b) => b - a);

  const catalog: PageCatalog = {
    years,
    yearSections,
  };

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(`${outputPath}`, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(
    `[search-catalog] Wrote ${outputPath} (${years.length} years)`,
  );
};

main();
