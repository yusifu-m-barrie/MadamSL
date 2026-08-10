export type HomepageVideo = {
  _key?: string;
  title?: string;
  sourceType?: "youtube" | "upload" | "url";
  youtubeUrl?: string;
  externalUrl?: string;
  fileUrl?: string;
  posterUrl?: string;
};

export type HomepageVideosDoc = {
  heading?: string;
  videos?: HomepageVideo[];
};

/** Extract a YouTube video id from common URL formats */
export function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const embed = u.pathname.match(/\/embed\/([^/]+)/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts) return shorts[1];
    }
  } catch {
    const m = url.match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/,
    );
    return m?.[1] ?? null;
  }
  return null;
}
