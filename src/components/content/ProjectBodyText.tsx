import { cn } from "@/lib/utils";

/**
 * Renders full project copy from the live MADAM site (plain text with
 * blank-line paragraphs, "Label:" headings, and - / 1. lists).
 */
export function ProjectBodyText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = parseBlocks(text);

  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h3
              key={i}
              className="pt-2 text-xl font-bold text-[var(--madam-ink)] md:text-2xl"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={i}
              className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-[var(--madam-muted)] md:text-xl"
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol
              key={i}
              className="list-decimal space-y-2 pl-6 text-lg leading-relaxed text-[var(--madam-muted)] md:text-xl"
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          );
        }
        return (
          <p
            key={i}
            className="text-lg leading-relaxed text-[var(--madam-muted)] md:text-xl"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;

  const flushParagraph = () => {
    const t = paragraph.join(" ").trim();
    if (t) blocks.push({ type: "p", text: t });
    paragraph = [];
  };

  const flushList = () => {
    if (list?.items.length) {
      blocks.push({ type: list.kind, items: list.items });
    }
    list = null;
  };

  const isHeading = (line: string) =>
    line.length < 56 &&
    /:$/.test(line) &&
    !/^[A-Z][a-z].{40,}:$/.test(line) &&
    /^[A-Za-z]/.test(line) &&
    line.split(" ").length <= 6;

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const bullet = line.match(/^[-•]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);

    if (bullet) {
      flushParagraph();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    if (numbered) {
      flushParagraph();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    flushList();

    if (isHeading(line)) {
      flushParagraph();
      blocks.push({ type: "heading", text: line.replace(/:$/, "") });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}
