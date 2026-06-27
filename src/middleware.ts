import { defineMiddleware } from "astro:middleware";
import { isLocale, setLocale } from "../paraglide/runtime.js";

/**
 * SSG ビルド時、各ページのレンダリング直前に URL 先頭セグメントから
 * ロケールを決定し paraglide に設定する。
 *
 * Astro の静的生成はページを逐次レンダリングするため、globalVariable 戦略と
 * 組み合わせた setLocale() でロケールの取り違えは起きない。
 */
export const onRequest = defineMiddleware((context, next) => {
  const segment = context.url.pathname.split("/")[1];
  if (isLocale(segment)) {
    setLocale(segment, { reload: false });
  }
  return next();
});
