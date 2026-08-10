import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import type { HomepageVideosDoc } from "@/sanity/types/videos";

export function VideoGallery({ data }: { data: HomepageVideosDoc | null }) {
  const videos = data?.videos?.filter(Boolean) ?? [];

  // Hide entirely when empty so homepage stays clean before editors add videos
  if (!videos.length) {
    return (
      <Section className="bg-white">
        <Container>
          {data?.heading ? <SectionHeading title={data.heading} align="center" /> : null}
          <div className="rounded-sm border border-dashed border-black/15 bg-[var(--madam-surface)] px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[var(--madam-ink)]">Videos</p>
            <p className="mt-2 text-base text-[var(--madam-muted)]">
              Add YouTube links or upload videos in{" "}
              <span className="font-medium text-[var(--madam-green)]">
                Studio → Homepage Videos
              </span>
              . They appear here in a two-column row under Latest News.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-white py-12 md:py-16">
      <Container>
        {data?.heading ? (
          <SectionHeading title={data.heading} align="center" />
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {videos.map((video, i) => (
            <article key={video._key || `${video.title}-${i}`} className="w-full">
              <VideoPlayer video={video} />
              {video.title ? (
                <h3 className="mt-3 text-base font-semibold text-[var(--madam-ink)] md:text-lg">
                  {video.title}
                </h3>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
