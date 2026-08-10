"use client";

import { extractYoutubeId, type HomepageVideo } from "@/sanity/types/videos";

function YoutubeEmbed({ url, title }: { url: string; title?: string }) {
  const id = extractYoutubeId(url);
  if (!id) {
    return (
      <div className="flex aspect-video items-center justify-center bg-black/80 px-4 text-center text-sm text-white/80">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <iframe
      className="absolute inset-0 h-full w-full"
      src={`https://www.youtube.com/embed/${id}`}
      title={title || "YouTube video"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

function FileVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title?: string;
}) {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      controls
      playsInline
      preload="metadata"
      poster={poster}
      title={title}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
}

export function VideoPlayer({ video }: { video: HomepageVideo }) {
  const type = video.sourceType || "youtube";

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black shadow-md">
      {type === "youtube" && video.youtubeUrl ? (
        <YoutubeEmbed url={video.youtubeUrl} title={video.title} />
      ) : null}

      {type === "upload" && video.fileUrl ? (
        <FileVideo src={video.fileUrl} poster={video.posterUrl} title={video.title} />
      ) : null}

      {type === "url" && video.externalUrl ? (
        <FileVideo
          src={video.externalUrl}
          poster={video.posterUrl}
          title={video.title}
        />
      ) : null}

      {type === "youtube" && !video.youtubeUrl ? (
        <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-white/70">
          Add a YouTube URL in Studio → Homepage Videos
        </div>
      ) : null}

      {type === "upload" && !video.fileUrl ? (
        <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-white/70">
          Upload a video file in Studio → Homepage Videos
        </div>
      ) : null}

      {type === "url" && !video.externalUrl ? (
        <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-white/70">
          Add an external video URL in Studio → Homepage Videos
        </div>
      ) : null}
    </div>
  );
}
