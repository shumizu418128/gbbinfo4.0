/**
 * `import.meta.url` を受け取り、親フォルダ名から年度を解析して返す。
 *
 * @param importMetaUrl - 呼び出し元ファイルの `import.meta.url`
 * @returns 親フォルダ名から解析した年度（整数）
 * @throws {Error} 親フォルダ名が整数でない場合
 *
 * @example
 * // app/routes/2026/top.tsx から呼ぶと 2026 を返す
 * const YEAR = getYearFromDir(import.meta.url);
 */
export const getYearFromDir = (importMetaUrl: string): number => {
  const parts = new URL(importMetaUrl).pathname.split("/");
  const dirName = parts[parts.length - 2];
  const year = Number(dirName);
  if (!Number.isFinite(year) || !Number.isInteger(year)) {
    throw new Error(
      `[getYearFromDir] フォルダ名から年度を取得できません: "${dirName}"`
    );
  }
  return year;
};
