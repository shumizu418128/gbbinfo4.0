import {
  baseLocale,
  supportedLanguages,
  ogLocales,
  type SupportedLanguage,
} from "~/constants/languageLabels.js";
import { staticAssetUrl } from "~/util/staticAsset.js";

/** 3.0 互換のサイト表示名（og:site_name / title 接尾辞） */
export const SITE_NAME = "GBBINFO-JPN";

/** 3.0 互換の theme-color（ブランドオレンジ） */
export const THEME_COLOR = "#ff6417";

/**
 * パス末尾のスラッシュを除く（ルートは `/` のまま）。
 *
 * Args:
 *   pathname: URL パス。
 *
 * Returns:
 *   正規化したパス。
 */
export const normalizePathname = (pathname: string): string => {
  if (pathname === "/") {
    return "/";
  }
  return pathname.replace(/\/+$/, "") || "/";
};

/**
 * 絶対 URL を組み立てる。
 *
 * Args:
 *   site: Astro.site（未設定時は相対のまま扱えないため null）。
 *   pathname: サイト内パス。
 *
 * Returns:
 *   絶対 URL。site が無い場合は pathname のみ。
 */
export const toAbsoluteUrl = (
  site: URL | undefined,
  pathname: string,
): string => {
  const path = normalizePathname(pathname);
  if (!site) {
    return path;
  }
  return new URL(path, site).href;
};

/**
 * 現在パスの言語プレフィックスを差し替えた代替パスを返す。
 *
 * Args:
 *   pathname: 現在のパス（`/{lang}/...` 想定）。
 *   targetLocale: 差し替え先言語。
 *
 * Returns:
 *   代替パス。言語セグメントが無い場合は `/{lang}`。
 */
export const replaceLocaleInPath = (
  pathname: string,
  targetLocale: SupportedLanguage,
): string => {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${targetLocale}`;
  }
  const first = segments[0];
  if ((supportedLanguages as string[]).includes(first)) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return `/${segments.join("/")}`;
};

export type HreflangLink = {
  hreflang: SupportedLanguage | "x-default";
  href: string;
};

/**
 * hreflang alternate 一覧（各言語 + x-default）を生成する。
 *
 * Args:
 *   site: Astro.site。
 *   pathname: 現在のパス。
 *
 * Returns:
 *   link rel=alternate 用の配列。
 */
export const buildHreflangLinks = (
  site: URL | undefined,
  pathname: string,
): HreflangLink[] => {
  const links: HreflangLink[] = supportedLanguages.map((locale) => ({
    hreflang: locale,
    href: toAbsoluteUrl(site, replaceLocaleInPath(pathname, locale)),
  }));
  links.push({
    hreflang: "x-default",
    href: toAbsoluteUrl(site, replaceLocaleInPath(pathname, baseLocale)),
  });
  return links;
};

/**
 * デフォルトの OGP / Twitter 用画像 URL を返す（3.0 の background.webp 相当）。
 *
 * Returns:
 *   Cloudflare Pages 上の background 画像 URL。
 */
export const defaultOgImageUrl = (): string =>
  staticAssetUrl("/images/background.webp");
