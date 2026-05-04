/*
 * このファイルは、pucelle.run-on-save で実行されるスクリプトです。
 * 各言語の JSON ファイルのキーを同期し、ソートして保存します。
 * baseLocale（project.inlang/settings.json）のキーを正とし、
 * 他言語に足りないキーは空文字で追加し、base に無いキーは削除します。
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const folderPath = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".json"));

type JsonObj = Record<string, unknown>;
const jsonFiles: { name: string; path: string; content: JsonObj }[] = [];

for (const file of files) {
  const filePath = path.join(folderPath, file);
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8")) as JsonObj;
    jsonFiles.push({ name: file, path: filePath, content });
  } catch {
    /* 壊れた JSON はスキップ */
  }
}

/**
 * inlang の設定から baseLocale を読み取る。
 *
 * Returns:
 *     設定の baseLocale。読めない場合は "ja"。
 */
function loadBaseLocale(): string {
  const settingsPath = path.join(
    folderPath,
    "..",
    "project.inlang",
    "settings.json",
  );
  try {
    const raw = fs.readFileSync(settingsPath, "utf-8");
    const settings = JSON.parse(raw) as { baseLocale?: string };
    if (typeof settings.baseLocale === "string" && settings.baseLocale) {
      return settings.baseLocale;
    }
  } catch {
    /* 設定が無い・壊れている場合はフォールバック */
  }
  return "ja";
}

const baseLocale = loadBaseLocale();
const baseFile = jsonFiles.find((j) => j.name === `${baseLocale}.json`);
if (!baseFile) {
  console.error(
    `Base locale file "${baseLocale}.json" が見つかりません。json-sync を中止します。`,
  );
  process.exit(1);
}

const baseKeys = Object.keys(baseFile.content)
  .filter((k) => k !== "$schema")
  .sort();

// $schema を末尾に置くため、いずれかのファイルから値だけ拾う
let schemaVal: string | undefined;
for (const j of jsonFiles) {
  if (typeof j.content["$schema"] === "string") {
    schemaVal = j.content["$schema"];
    break;
  }
}

// baseLocale のキー集合に合わせて同期・ソート
for (const j of jsonFiles) {
  const orig = j.content;
  const synced: JsonObj = {};
  for (const key of baseKeys) {
    synced[key] = Object.hasOwn(orig, key) ? orig[key] : "";
  }
  if (schemaVal) synced["$schema"] = schemaVal;
  fs.writeFileSync(j.path, JSON.stringify(synced, null, 2) + "\n", "utf-8");
}

console.log("JSON files synchronized successfully.");
