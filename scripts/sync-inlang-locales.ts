/*
 * languageLabels.ts の対応言語を project.inlang/settings.json に反映する。
 * dev / build の前に実行される。
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  baseLocale,
  supportedLanguages,
} from "../src/constants/languageLabels.ts";

const settingsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../project.inlang/settings.json",
);

const settings = JSON.parse(readFileSync(settingsPath, "utf-8")) as {
  baseLocale?: string;
  locales?: string[];
  [key: string]: unknown;
};

settings.baseLocale = baseLocale;
settings.locales = [...supportedLanguages];

writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n", "utf-8");
