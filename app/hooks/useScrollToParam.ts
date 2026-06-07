import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router";

const SECTION_ID_SUFFIX = "-section";

const HEADER_OFFSET = 50;

if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/**
 * scroll クエリまたは hash からスクロール先のセクション id を解決する。
 *
 * `?scroll=` は次の順で解決する。
 * 1. `data-scroll-key` が一致する要素の id（3.0 互換の別名）
 * 2. `{scrollTarget}-section` が DOM に存在する id
 *
 * @param scrollTarget `?scroll=` の値。
 * @param hash 現在の location.hash（先頭 `#` 付き）。
 * @returns スクロール先 id。該当なしのとき null。
 */
const resolveSectionId = (
  scrollTarget: string | null,
  hash: string,
): string | null => {
  if (scrollTarget) {
    const byScrollKey = document.querySelector(
      `[data-scroll-key="${CSS.escape(scrollTarget)}"]`,
    );
    if (byScrollKey instanceof HTMLElement && byScrollKey.id) {
      return byScrollKey.id;
    }

    const conventionalId = `${scrollTarget}${SECTION_ID_SUFFIX}`;
    if (document.getElementById(conventionalId)) {
      return conventionalId;
    }
  }

  if (hash.length > 1) {
    return decodeURIComponent(hash.slice(1));
  }

  return null;
};

/**
 * 指定セクションへヘッダー分オフセットを考慮してスクロールする。
 *
 * @param sectionId スクロール先要素の id。
 * @returns 要素が存在してスクロールした場合 true。
 */
const scrollToSection = (sectionId: string): boolean => {
  const element = document.getElementById(sectionId);
  if (!element) {
    return false;
  }

  const y =
    element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
  return true;
};

/**
 * URL の scroll クエリまたは hash に応じて該当セクションへスクロールする。
 * 同一ページ内の `#section` リンクもブラウザ標準ジャンプの代わりにこちらを使う。
 */
export const useScrollToParam = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const scrollTarget = searchParams.get("scroll");
  const { hash, pathname, search } = location;
  const isInitialScroll = useRef(true);

  useLayoutEffect(() => {
    const sectionId = resolveSectionId(scrollTarget, hash);
    if (!sectionId) {
      return;
    }

    if (isInitialScroll.current) {
      isInitialScroll.current = false;
      window.scrollTo({ top: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        scrollToSection(sectionId);
      });
      return;
    }

    scrollToSection(sectionId);
  }, [scrollTarget, hash]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const sectionId = decodeURIComponent(href.slice(1));
      if (!document.getElementById(sectionId)) {
        return;
      }

      event.preventDefault();
      scrollToSection(sectionId);
      window.history.pushState(null, "", `${pathname}${search}#${sectionId}`);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname, search]);
};
