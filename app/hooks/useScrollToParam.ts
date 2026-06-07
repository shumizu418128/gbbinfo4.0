import { useEffect } from "react";
import { useSearchParams } from "react-router";

/** ?scroll= クエリとセクション id の対応（3.0 互換）。 */
const SCROLL_TARGETS: Record<string, string> = {
  category: "category-section",
  "comeback-wildcard": "comeback-wildcard-section",
  seeds: "seeds-section",
  result_date: "wildcard-rules-section",
  judges: "main-judges-section",
  "second-league": "second-league-section",
};

const HEADER_OFFSET = 50;

/**
 * URL の scroll クエリに応じて該当セクションへスクロールする。
 */
export const useScrollToParam = () => {
  const [searchParams] = useSearchParams();
  const scrollTarget = searchParams.get("scroll");

  useEffect(() => {
    if (!scrollTarget) {
      return;
    }

    const sectionId = SCROLL_TARGETS[scrollTarget];
    if (!sectionId) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    const y =
      element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [scrollTarget]);
};
