import path from "node:path";

export const BAN_WORDS = [
  "HATEN",
  "BEATCITY",
  "BCJ",
  "JPN CUP",
  "WIKI",
  "/PLAYLIST",
] as const;

export const TAVILY_EXCLUDE_DOMAINS = [
  "tiktok.com",
  "reddit.com",
  "swissbeatbox.com",
  "gbbinfo-jpn.onrender.com",
] as const;

/** ローカル Tavily キャッシュ（gitignore）。 */
export const LOCAL_TAVILY_CACHE_DIR = path.join(process.cwd(), ".cache/tavily");
