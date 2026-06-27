export const TAVILY_EXCLUDE_DOMAINS = [
  "tiktok.com",
  "reddit.com",
  "swissbeatbox.com",
  "gbbinfo-jpn.onrender.com",
] as const;

export const BAN_WORDS = [
  "HATEN",
  "BEATCITY",
  "BCJ",
  "JPN CUP",
  "WIKI",
  "/PLAYLIST",
] as const;

export const FACEBOOK_ACCOUNT_PATTERN =
  /^(https?:\/\/)?((www|m)\.)?facebook\.com\/[a-zA-Z0-9_.]+\/?$/;

export const INSTAGRAM_ACCOUNT_PATTERN =
  /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;

export const SPOTIFY_ACCOUNT_PATTERN =
  /^(https?:\/\/)?(open\.)?spotify\.com\/artist\/[a-zA-Z0-9]+\/?$/;

export const TWITTER_ACCOUNT_PATTERN =
  /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/;

export const SOUNDCLOUD_ACCOUNT_PATTERN =
  /^(https?:\/\/)?(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/?$/;

export const YOUTUBE_CHANNEL_PATTERN =
  /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)[a-zA-Z0-9_-]+\/?$/;
