import { ChevronDown, ChevronLeft, ChevronRight, Lock, Play } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  EDITIONS,
  MENU_EDITIONS,
  STORY_SOURCES,
  type EditionId,
  type SourceBias,
  type WeekEdition,
  type WeekStory,
} from "./stories";
import { realMorningEdition } from "./edition";

/** Editorial face from the homepage: Palatino. UI chrome is Arial. */

function Image({
  src,
  alt = "",
  className,
  fill,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
      style={style}
    />
  );
}

function Link({
  href,
  className,
  style,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  "aria-current"?: "page";
}) {
  return (
    <a href={href} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}

const WEEK_FONT =
  "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
const UI_FONT = "Arial, Helvetica, sans-serif";
const READING_BAR = 52;
const CREAM = "#F4F0EA";
const WARM = "#F0EAE1";

const roman: CSSProperties = { fontFamily: WEEK_FONT, fontWeight: 400 };
const romanBold: CSSProperties = { fontFamily: WEEK_FONT, fontWeight: 700 };
const ui: CSSProperties = { fontFamily: UI_FONT, fontWeight: 400 };
const uiBold: CSSProperties = { fontFamily: UI_FONT, fontWeight: 700 };

const BRIEFING_EDITIONS = EDITIONS.filter((edition) => edition.id !== "all");

type MorningAccess = "open" | "blur" | "redacted";
type WeekBoard = "off" | "mobile" | "desktop" | "subscribe" | "direction" | "convert" | "ad-1" | "ad-2" | "ad-3";

const MORNING_ACCESS: { id: MorningAccess; label: string }[] = [
  { id: "open", label: "Report" },
  { id: "blur", label: "Premium" },
  { id: "redacted", label: "Redacted" },
];

const DIGITAL_SUBSCRIBE =
  "https://subscribe.theweek.com/pubs/W0/TWE/self1023_3formats_Dlink.jsp?cds_mag_code=TWE&cds_page_id=275740";

const NAV_ITEMS = [
  "Talking Points",
  "The Week Recommends",
  "Opinion",
  "Culture",
  "Life",
  "Health",
  "Cartoons",
  "More",
  "Newsletters",
];

function storyNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function storyGround(index: number): string {
  return index % 2 === 0 ? CREAM : WARM;
}

/** Only colours from The Week: brand red, brand teal, and the homepage blue and slate. */
const WEEK_RED = "#DF0A14";
const WEEK_TEAL = "#455E61";
const WEEK_BLUE = "#1068B0";
const WEEK_SLATE = "#304050";

const TYPE_INK: Record<string, string> = {
  "Main story": WEEK_RED,
  Politics: WEEK_RED,
  Religion: WEEK_RED,
  Disaster: WEEK_RED,
  "Talking points": WEEK_RED,
  "Big question": WEEK_RED,
  Commentary: WEEK_RED,
  Viewpoint: WEEK_RED,
  "Only in America": WEEK_RED,
  "Under the radar": WEEK_TEAL,
  Explainer: WEEK_TEAL,
  Recommends: WEEK_TEAL,
  Briefing: WEEK_TEAL,
  People: WEEK_TEAL,
  "Food & drink": WEEK_TEAL,
  "It's not all bad": WEEK_TEAL,
  "It wasn't all bad": WEEK_TEAL,
  "On this day": WEEK_BLUE,
  Statistic: WEEK_BLUE,
  "Quote of the day": WEEK_BLUE,
  Book: WEEK_BLUE,
  "Film review": WEEK_BLUE,
  "TV review": WEEK_BLUE,
  Cartoon: WEEK_SLATE,
  Newspapers: WEEK_SLATE,
  Obituary: WEEK_SLATE,
  "Picture of the day": WEEK_SLATE,
  Puzzle: WEEK_SLATE,
  "Tall tale": WEEK_SLATE,
  "Good / bad day": WEEK_SLATE,
};

function typeInk(chip: string): string {
  return TYPE_INK[chip] ?? WEEK_RED;
}

function typeWash(chip: string): string {
  return `color-mix(in srgb, ${typeInk(chip)} 16%, ${CREAM})`;
}

function WeekWordmark() {
  return (
    <div
      className="bg-[#DF0A14] px-4 py-2 text-center text-base font-bold tracking-[0.22em] text-white sm:px-6 lg:px-8 lg:py-3.5 lg:text-[26px] lg:leading-none lg:tracking-[0.28em]"
      style={romanBold}
    >
      THE WEEK
    </div>
  );
}

function RedRule() {
  return <div className="h-[7px] w-[86px] bg-[#DF0A14]" aria-hidden />;
}

function StorySectionHeading({ children }: { children: string }) {
  return (
    <div>
      <h3
        className="text-[32px] leading-10 text-black md:text-[40px] md:leading-[48px] xl:text-[48px] xl:leading-[56px]"
        style={roman}
      >
        {children}
      </h3>
      <div className="mt-[10px]">
        <RedRule />
      </div>
    </div>
  );
}

function StoryBody({ children }: { children: string }) {
  return (
    <p className="mt-7 max-w-[65ch] text-[20px] leading-[26px] text-black" style={roman}>
      {children}
    </p>
  );
}

function QuoteMark() {
  return (
    <svg
      className="mt-2 h-10 w-[52px] shrink-0"
      viewBox="0 130 52 40"
      fill="none"
      aria-hidden
    >
      <path
        d="M51.3797 134.046C46.9979 136.135 43.5661 138.566 41.0844 141.339C38.6027 144.112 37.1679 147.474 36.7802 151.425L40.0374 151.425C42.4416 151.425 44.3998 151.69 45.9121 152.222C47.4245 152.754 48.6459 153.495 49.5766 154.444C50.4685 155.356 51.1083 156.363 51.496 157.464C51.845 158.566 52.0195 159.706 52.0195 160.883C52.0195 163.314 51.0307 165.442 49.0531 167.265C47.0367 169.088 44.6713 170 41.9569 170C37.6914 170 34.4148 168.613 32.1269 165.84C29.8391 163.067 28.6951 159.231 28.6951 154.33C28.6951 149.772 30.6728 145.176 34.628 140.541C38.5445 135.907 43.2753 132.393 48.8204 130L51.3797 134.046ZM22.7041 134.046C18.3223 136.135 14.8905 138.566 12.4088 141.339C9.92706 144.112 8.49231 147.474 8.10454 151.424L11.3618 151.424C13.766 151.424 15.7242 151.69 17.2365 152.222C18.7488 152.754 19.9703 153.495 20.901 154.444C21.7928 155.356 22.4327 156.363 22.8204 157.464C23.1694 158.566 23.3439 159.706 23.3439 160.883C23.3439 163.314 22.3551 165.442 20.3775 167.265C18.3611 169.088 15.9957 170 13.2813 170C9.0158 170 5.73914 168.613 3.45129 165.84C1.16345 163.067 0.019527 159.231 0.0195274 154.33C0.0195278 149.772 1.99716 145.176 5.95242 140.541C9.8689 135.907 14.5997 132.393 20.1448 130L22.7041 134.046Z"
        fill="#DF0A14"
      />
    </svg>
  );
}

function StoryQuote({ story }: { story: WeekStory }) {
  return (
    <figure className="max-w-[635px]">
      <div className="flex items-start gap-[15px]">
        <QuoteMark />
        <blockquote
          className="min-w-0 text-[28px] italic leading-9 text-black md:leading-[56px]"
          style={roman}
        >
          {story.quote}
        </blockquote>
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#4B5563]" style={ui}>
        Quote{story.quoteAttribution ? ` · ${story.quoteAttribution}` : ""}
      </p>
    </figure>
  );
}

function StoryStats({ story }: { story: WeekStory }) {
  return (
    <div className="max-w-[635px]">
      {story.statsHeading ? (
        <StorySectionHeading>{story.statsHeading}</StorySectionHeading>
      ) : null}
      <div
        className={`grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 ${
          story.statsHeading ? "mt-7" : ""
        }`}
      >
        {story.stats.map((stat) => (
          <div key={stat.label}>
            <div className="h-px w-10 bg-[#DF0A14]" aria-hidden />
            <p
              className="mt-4 text-[32px] leading-[38px] text-black lg:text-[40px] lg:leading-[46px]"
              style={roman}
            >
              {stat.value}
            </p>
            <p
              className="mt-3 text-[14px] uppercase leading-5 text-[#4B5563]"
              style={ui}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      {story.statsNote ? (
        <p
          className="mt-10 max-w-[635px] text-[16px] leading-[26px] text-[#4B5563]"
          style={roman}
        >
          {story.statsNote}
        </p>
      ) : null}
    </div>
  );
}

function ImageLightbox({
  story,
  onClose,
}: {
  story: WeekStory | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!story) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [story, onClose]);

  if (!story?.imageSrc || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={story.imageCaption}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center text-[32px] leading-none text-white"
      >
        ×
      </button>
      <figure
        className="flex max-h-full w-full max-w-6xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Full file, not the cropped frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.imageSrc}
          alt={story.imageCaption}
          className="max-h-[82vh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-3 max-w-[65ch] text-center text-[14px] leading-5 text-white/85" style={ui}>
          {story.imageCaption}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}

function onThisDayDate(dek: string): string {
  const [date] = dek.split(":");
  return date.trim();
}

function DatePlate({ story, compact = false }: { story: WeekStory; compact?: boolean }) {
  const date = onThisDayDate(story.dek);
  const year = date.match(/\d{4}/)?.[0] ?? "";
  const day = date.replace(year, "").replace(/,\s*$/, "").trim();

  return (
    <div className="flex h-full flex-col justify-between bg-[#1068B0] p-6 text-white sm:p-8">
      <p className="text-[12px] font-bold uppercase tracking-[0.16em]" style={uiBold}>
        On this day
      </p>
      <div>
        <p className="text-[18px] leading-6" style={roman}>
          {day}
        </p>
        <p
          className={compact ? "text-[72px] leading-none" : "text-[88px] leading-none sm:text-[104px]"}
          style={roman}
        >
          {year}
        </p>
      </div>
      <p className="max-w-[16ch] text-[22px] leading-7" style={roman}>
        {story.displayTitle}
      </p>
    </div>
  );
}

function StoryPhoto({
  story,
  priority = false,
  onExpand,
}: {
  story: WeekStory;
  priority?: boolean;
  onExpand?: (story: WeekStory) => void;
}) {
  if (!story.imageSrc) {
    if (story.chip === "On this day") {
      return (
        <div className="aspect-[16/10] w-full">
          <DatePlate story={story} compact />
        </div>
      );
    }
    return (
      <div
        className="flex aspect-[16/10] w-full items-end p-6"
        style={{ background: story.imageGradient }}
      >
        <p className="max-w-md text-2xl text-white" style={roman}>
          {story.displayTitle}
        </p>
      </div>
    );
  }

  const frame = (
    <Image
      src={story.imageSrc}
      alt=""
      fill
      priority={priority}
      sizes="(min-width: 1024px) 40vw, 100vw"
      className={story.imageFit === "contain" ? "object-contain" : "object-cover"}
    />
  );

  if (!onExpand) {
    return (
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden ${
          story.imageFit === "contain" ? "bg-white" : ""
        }`}
      >
        {frame}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onExpand(story)}
      aria-label={`Expand image: ${story.imageCaption}`}
      className={`relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden ${
        story.imageFit === "contain" ? "bg-white" : ""
      }`}
    >
      {frame}
      <span
        aria-hidden
        className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
        style={uiBold}
      >
        Expand
      </span>
    </button>
  );
}

function StoryChip({ chip, label, beside = false }: { chip: string; label?: string; beside?: boolean }) {
  return (
    <span
      className={`${beside ? "shrink-0" : "mt-1"} inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold uppercase leading-none tracking-[0.08em]`}
      style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontWeight: 700,
        background: typeWash(chip),
        color: typeInk(chip),
      }}
    >
      {label ?? chip}
    </span>
  );
}

const WEEK_SUDOKU = "https://theweek.com/puzzles/medium-sudoku-october-2026";

function WeekSudoku() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kwizly.com/embed/OLYE9X.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="mt-8">
      <div className="kwizly-quiz kwizly-OLYE9X min-h-[520px] w-full" />
      <a
        href={WEEK_SUDOKU}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center text-[14px] font-bold text-[#DF0A14]"
        style={uiBold}
      >
        Play on The Week
      </a>
    </div>
  );
}

function StoryVideo({ story }: { story: WeekStory }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!story.videoSrc || !story.imageSrc) return null;

  return (
    <figure className="max-w-[635px]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play video"
        className="relative block aspect-video w-full overflow-hidden bg-black"
      >
        <Image
          src={story.imageSrc}
          alt=""
          fill
          sizes="(min-width: 768px) 635px, 100vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-black/30" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black">
          <Play size={26} fill="currentColor" aria-hidden className="ml-0.5" />
        </span>
      </button>
      <figcaption className="mt-2 text-[13px] leading-5 text-[#4B5563]" style={ui}>
        Video
      </figcaption>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Video"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-10"
              onClick={close}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close video"
                className="absolute right-4 top-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center text-[32px] leading-none text-white"
              >
                ×
              </button>
              <div className="w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
                <video
                  src={story.videoSrc}
                  poster={story.imageSrc}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[82vh] w-full bg-black"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </figure>
  );
}

const SUBSCRIPTION_BENEFITS = [
  { n: "01", title: "Daily Editions", text: "Morning, evening and weekend reports that matter." },
  { n: "02", title: "Unlimited website access", text: "Explore unlimited news, analysis and perspectives." },
  { n: "03", title: "Puzzles & daily features", text: "Enjoy puzzles, quizzes and daily features." },
  { n: "04", title: "Wherever you read", text: "Stay informed across website, app and newsletters." },
];

function GateFile() {
  return (
    <div className="bg-[#F0EAE1] px-4 py-4">
      <p className="text-[16px] leading-6 text-[#1B1B1B]" style={roman}>
        The rest of this article is locked. Sign up for the coverage: news and opinion from over 200 sources, gathered in one place.
      </p>
      <ol className="mt-4">
        {SUBSCRIPTION_BENEFITS.map((benefit) => (
          <li key={benefit.n} className="flex gap-3 border-t border-black/15 py-3">
            <span className="w-7 shrink-0 text-[15px] leading-5 text-[#374151]" style={roman}>
              {benefit.n}
            </span>
            <span className="min-w-0">
              <span className="block text-[16px] leading-5 text-black" style={romanBold}>
                {benefit.title}
              </span>
              <span className="mt-0.5 block text-[14px] leading-5 text-[#374151]" style={roman}>
                {benefit.text}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={DIGITAL_SUBSCRIBE}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center bg-[#DF0A14] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white"
          style={uiBold}
        >
          Explore subscriptions
        </a>
        <a
          href="https://theweek.com/"
          className="inline-flex h-11 items-center border border-[#0A0A0A] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-black"
          style={uiBold}
        >
          Create a free account
        </a>
      </div>
      <p className="mt-4 text-[14px] leading-5 text-[#374151]" style={roman}>
        Already a subscriber?{" "}
        <a href="https://theweek.com/" className="font-bold text-black underline">
          Sign in
        </a>{" "}
        with the same email.{" "}
        <a href="https://theweek.com/" className="font-bold text-black underline">
          Contact us
        </a>{" "}
        if you can’t remember which one.
      </p>
    </div>
  );
}

function GateBanner() {
  return (
    <section aria-label="Continue reading" className="w-full max-w-[635px]">
      <GateFile />
    </section>
  );
}

const REDACTED_BARS =
  "pointer-events-none select-none [&_blockquote]:text-transparent [&_blockquote]:leading-[1.85] [&_blockquote]:[background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_0.2em,#0A0A0A_0.2em,#0A0A0A_1.22em,transparent_1.22em,transparent_1.85em)] [&_li]:text-transparent [&_li]:leading-[1.85] [&_li]:[background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_0.2em,#0A0A0A_0.2em,#0A0A0A_1.22em,transparent_1.22em,transparent_1.85em)] [&_p]:text-transparent [&_p]:leading-[1.85] [&_p]:[background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_0.2em,#0A0A0A_0.2em,#0A0A0A_1.22em,transparent_1.22em,transparent_1.85em)]";

function SignUpToUnlock() {
  return (
    <a
      href={DIGITAL_SUBSCRIBE}
      target="_blank"
      rel="noreferrer"
      className="pointer-events-auto inline-flex h-9 items-center gap-2 bg-[#DF0A14] px-3 text-[12px] font-bold uppercase tracking-[0.04em] text-white"
      style={uiBold}
    >
      <Lock size={16} strokeWidth={2.4} aria-hidden />
      Sign up to unlock
    </a>
  );
}

function ArticleSubscribe({ tone, children }: { tone: "unlock" | "redacted"; children: ReactNode }) {
  const redacted = tone === "redacted";
  return (
    <div data-subscribe-gate className={`relative max-w-[635px] ${redacted ? "" : "mt-10"}`}>
      <div className="border-l-2 border-dashed border-[#DF0A14] pl-4">
        <SignUpToUnlock />
        {redacted ? (
          <div inert aria-hidden className={`mt-4 ${REDACTED_BARS}`}>
            {children}
          </div>
        ) : (
          <div className="relative mt-4 max-h-[22rem] overflow-hidden">
            <div inert aria-hidden className="pointer-events-none select-none blur-[6px]">
              {children}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F4F0EA]" />
          </div>
        )}
      </div>
      <div className="relative z-20 mt-8 lg:hidden">
        <GateBanner />
      </div>
    </div>
  );
}

function GatedStoryBody({
  story,
  access,
  lead,
  showHeader,
}: {
  story: WeekStory;
  access: MorningAccess;
  lead: boolean;
  showHeader?: boolean;
}) {
  if (access === "open") return <StoryFormatBody story={story} />;

  const header =
    showHeader && !lead ? (
      <div className="max-w-[635px]">
        <p
          className="inline-flex h-7 w-fit items-center px-1.5 text-[12px] font-bold uppercase text-white"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 700,
            background: typeInk(story.chip),
          }}
        >
          {story.kicker}
        </p>
        <h3 className="mt-3 text-[28px] leading-8 text-black" style={roman}>
          {story.dek}
        </h3>
      </div>
    ) : null;

  const opening = lead ? (
    <section className="max-w-[635px]">
      {access === "blur" ? (
        <p className="mb-8 max-w-[42ch] text-[16px] leading-6 text-[#374151]" style={roman}>
          We don’t tell you what to think. The opening is the point. The locked part is how the story was covered.
        </p>
      ) : null}
      <StorySectionHeading>What happened</StorySectionHeading>
      <StoryBody>{story.whatHappened}</StoryBody>
    </section>
  ) : null;

  return (
    <>
      {header}
      {opening}
      <ArticleSubscribe tone={access === "redacted" ? "redacted" : "unlock"}>
        {lead && story.format === "news" ? (
          <StoryFormatBody story={story} part="rest" />
        ) : (
          <StoryFormatBody story={story} />
        )}
      </ArticleSubscribe>
    </>
  );
}

function StoryFormatBody({ story, part = "all" }: { story: WeekStory; part?: "all" | "rest" }) {
  if (story.format === "tale") {
    return (
      <>
        <section className="max-w-[635px]">
          <StorySectionHeading>The tale</StorySectionHeading>
          <p
            className="mt-7 max-w-[65ch] border-l-2 border-[#DF0A14] pl-5 text-[22px] italic leading-8 text-black"
            style={roman}
          >
            {story.whatHappened}
          </p>
        </section>
        {story.quote ? <StoryQuote story={story} /> : null}
        {story.stats.length > 0 ? <StoryStats story={story} /> : null}
      </>
    );
  }

  if (story.format === "quote") {
    return (
      <>
        {story.quote ? <StoryQuote story={story} /> : null}
        <section className="max-w-[635px]">
          <StorySectionHeading>Who said it</StorySectionHeading>
          <StoryBody>{story.whatHappened}</StoryBody>
        </section>
      </>
    );
  }

  if (story.format === "day") {
    return (
      <div className="grid max-w-[635px] grid-cols-1 gap-10 sm:grid-cols-2">
        {(story.items ?? []).map((item) => (
          <section key={item.label}>
            <p
              className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]"
              style={uiBold}
            >
              {item.label}
            </p>
            <div className="mt-3 h-px w-10 bg-[#DF0A14]" aria-hidden />
            <p className="mt-5 text-[20px] leading-[28px] text-black" style={roman}>
              {item.text}
            </p>
          </section>
        ))}
      </div>
    );
  }

  if (story.format === "stat") {
    const [lead, ...rest] = story.stats;
    return (
      <div className="max-w-[635px]">
        {lead ? (
          <div>
            <div className="h-px w-16 bg-[#DF0A14]" aria-hidden />
            <p className="mt-4 text-[64px] leading-none text-black xl:text-[80px]" style={roman}>
              {lead.value}
            </p>
            <p className="mt-4 text-[14px] uppercase tracking-[0.08em] text-[#4B5563]" style={ui}>
              {lead.label}
            </p>
          </div>
        ) : null}
        <p className="mt-8 max-w-[65ch] text-[20px] leading-[26px] text-black" style={roman}>
          {story.whatHappened}
        </p>
        {rest.length > 0 ? (
          <div className="mt-10">
            <StoryStats story={{ ...story, stats: rest, statsHeading: "" }} />
          </div>
        ) : null}
      </div>
    );
  }

  if (story.format === "picture") {
    return (
      <figure className="max-w-[635px]">
        <p className="text-[24px] italic leading-9 text-black" style={roman}>
          {story.whatHappened}
        </p>
        <figcaption className="mt-4 text-[13px] leading-5 text-[#4B5563]" style={ui}>
          {story.imageCaption}
        </figcaption>
      </figure>
    );
  }

  if (story.format === "puzzle") {
    return (
      <section className="max-w-[635px] border border-black/15 bg-white px-6 py-8">
        <p
          className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]"
          style={uiBold}
        >
          Today’s puzzle
        </p>
        <p className="mt-4 text-[22px] leading-8 text-black" style={roman}>
          {story.dek}
        </p>
        <p className="mt-4 text-[18px] leading-7 text-[#374151]" style={roman}>
          {story.whatHappened}
        </p>
        <WeekSudoku />
      </section>
    );
  }

  if (story.format === "recommend") {
    return (
      <>
        <section className="max-w-[635px]">
          <StorySectionHeading>Worth your time</StorySectionHeading>
          <StoryBody>{story.whatHappened}</StoryBody>
        </section>
        {story.quote ? <StoryQuote story={story} /> : null}
        {story.stats.length > 0 ? <StoryStats story={story} /> : null}
      </>
    );
  }

  if (story.format === "papers") {
    return (
      <ul className="max-w-[635px] border-t border-black/15">
        {(story.items ?? []).map((item) => (
          <li key={item.label} className="border-b border-black/15 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#DF0A14]" style={uiBold}>
              {item.label}
            </p>
            <p className="mt-1 text-[22px] leading-7 text-black" style={roman}>
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  if (story.format === "cartoon") {
    return (
      <figure className="max-w-[635px]">
        <p className="text-[22px] italic leading-8 text-black" style={roman}>
          {story.whatHappened}
        </p>
        <figcaption className="mt-4 text-[13px] leading-5 text-[#4B5563]" style={ui}>
          The Week · Cartoons · {story.imageCaption}
        </figcaption>
      </figure>
    );
  }

  return (
    <>
      {part === "all" ? (
        <section className="max-w-[635px]">
          <StorySectionHeading>What happened</StorySectionHeading>
          <StoryBody>{story.whatHappened}</StoryBody>
        </section>
      ) : null}
      {story.videoSrc ? <StoryVideo story={story} /> : null}
      {story.quote ? <StoryQuote story={story} /> : null}
      {story.whoSaidWhat ? (
        <section className="max-w-[635px]">
          <StorySectionHeading>Who said what</StorySectionHeading>
          <StoryBody>{story.whoSaidWhat}</StoryBody>
        </section>
      ) : null}
      {story.stats.length > 0 ? <StoryStats story={story} /> : null}
      {story.whatsNext ? (
        <section className="max-w-[65ch]">
          <StorySectionHeading>What’s next?</StorySectionHeading>
          <StoryBody>{story.whatsNext}</StoryBody>
        </section>
      ) : null}
    </>
  );
}

const BIAS_LABEL: Record<SourceBias, string> = {
  left: "Left",
  "lean-left": "Lean Left",
  center: "Center",
  "lean-right": "Lean Right",
  right: "Right",
};

function BiasPill({ bias }: { bias: SourceBias }) {
  const label = BIAS_LABEL[bias];
  if (bias === "center") {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#D1D5DB] px-2 text-[12px] leading-4 text-black" style={roman}>
        <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
        {label}
      </span>
    );
  }
  const left = bias === "left" || bias === "lean-left";
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[12px] leading-4 text-[#FAFAFA] ${left ? "bg-[#DF0A14]" : "bg-[#1068B0]"}`}
      style={roman}
    >
      {left ? <ChevronLeft size={12} strokeWidth={2.5} aria-hidden /> : null}
      {label}
      {left ? null : <ChevronRight size={12} strokeWidth={2.5} aria-hidden />}
    </span>
  );
}

function EditionSources({ stories }: { stories: WeekStory[] }) {
  const outlets = stories.flatMap((story) => (story.sources ?? STORY_SOURCES[story.id])?.outlets ?? []).filter((outlet, index, all) => all.findIndex((item) => item.name === outlet.name) === index);
  const note = outlets.length === 0 ? "This edition does not name a rated news outlet." : "";

  return (
    <section aria-label="Sources behind this edition" className="mt-10 border-t border-black/10 pt-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-[15px] leading-5 text-[#6B7280]" style={roman}>
            Sources behind this edition
          </h3>
          <a
            href="https://www.allsides.com/media-bias/media-bias-ratings"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[13px] leading-5 text-[#6B7280] underline decoration-[#D1D5DB] underline-offset-2 hover:text-black"
            style={roman}
          >
            See all sources
            <ChevronRight size={12} aria-hidden />
          </a>
        </div>
        <p className="max-w-[62ch] text-[13px] leading-5 text-[#9CA3AF]" style={roman}>
          News-outlet bias ratings by AllSides—not ratings of this story or factual accuracy.
          {note ? ` ${note}` : ""}
        </p>
        {outlets.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {outlets.map((source) => (
              <li key={source.name} className="flex items-center justify-between gap-3 border border-black/10 bg-white px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block text-[15px] leading-5 text-black" style={roman}>
                    {source.name}
                  </span>
                  <span className="block text-[12px] leading-4 text-[#9CA3AF]" style={roman}>
                    {BIAS_LABEL[source.bias]} (AllSides)
                  </span>
                </span>
                <BiasPill bias={source.bias} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StoryColumn({
  story,
  index,
  next,
  onSelect,
  onExpand,
  access,
}: {
  story: WeekStory;
  index: number;
  next?: WeekStory;
  onSelect: (id: string) => void;
  onExpand: (story: WeekStory) => void;
  access: MorningAccess;
}) {
  const ground = storyGround(index);

  return (
    <article
      id={story.id}
      className={`relative z-0 scroll-mt-20 pb-16 lg:pb-24 ${
        index > 0 ? "pt-16 md:pt-20 xl:pt-24" : ""
      }`}
      style={{ background: ground }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-[100vw] -right-[100vw] -z-10 lg:right-0"
        style={{ background: ground }}
      />
      <div className="lg:flex lg:min-h-[min(46vh,380px)] lg:flex-col lg:justify-center lg:pr-[0px] xl:pr-[0px]">
        <p
          className="inline-flex h-7 w-fit items-center gap-2 px-1.5 py-1 text-[14px] font-bold uppercase leading-5 text-white"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 700,
            background: typeInk(story.chip),
          }}
        >
          <span>{storyNumber(index)}</span>
          <span>{story.kicker}</span>
        </p>
        {story.chip === "On this day" ? (
          <>
            <p
              className="mt-6 text-[15px] font-bold uppercase tracking-[0.14em] text-[#1068B0]"
              style={uiBold}
            >
              {onThisDayDate(story.dek)}
            </p>
            <h2
              className="mt-3 text-[36px] leading-[42px] text-black md:text-[42px] md:leading-[48px] xl:text-[48px] xl:leading-[56px]"
              style={roman}
            >
              {story.displayTitle}
            </h2>
            <p className="mt-4 max-w-[36ch] text-[18px] leading-7 text-[#374151]" style={roman}>
              {story.whatHappened.split(". ")[1]}.
            </p>
          </>
        ) : (
          <>
            <h2
              className="mt-5 text-[36px] leading-[42px] text-black md:text-[42px] md:leading-[48px] xl:text-[48px] xl:leading-[56px]"
              style={roman}
            >
              {story.dek}
            </h2>
            {story.displayTitle ? (
              <p className="mt-4 max-w-[65ch] text-[18px] leading-7 text-[#374151]" style={roman}>
                {story.displayTitle}
              </p>
            ) : null}
          </>
        )}
      </div>

      <figure className="mt-8 lg:hidden">
        <StoryPhoto story={story} priority={index === 0} onExpand={onExpand} />
        <figcaption
          className="mt-2 max-w-[65ch] text-[13px] leading-5 text-[#4B5563]"
          style={ui}
        >
          {story.imageCaption}
        </figcaption>
      </figure>

      <div className="mt-16 flex flex-col gap-16 xl:mt-24 xl:gap-24">
        <GatedStoryBody story={story} access={access} lead={index === 0} />
      </div>

      {next ? (
        <button
          type="button"
          onClick={() => onSelect(next.id)}
          className="mt-16 flex min-h-11 w-full max-w-[65ch] flex-col items-start border-t border-black/15 pt-8 text-left xl:mt-24"
        >
          <span
            className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]"
            style={uiBold}
          >
            Up next
          </span>
          <span
            className="mt-3 text-[28px] leading-9 text-black md:text-[32px] md:leading-10"
            style={roman}
          >
            {next.dek}
          </span>
        </button>
      ) : null}
    </article>
  );
}

function EditionsDropdown({
  trigger,
  onEdition,
  onAll,
}: {
  trigger: "nav" | "header";
  onEdition: (id: EditionId) => void;
  onAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const openEdition = (id: EditionId) => {
    setOpen(false);
    onEdition(id);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={
          trigger === "nav"
            ? "inline-flex min-h-11 items-center whitespace-nowrap px-5 text-[14px] font-bold leading-[20px] text-[#DF0A14]"
            : "inline-flex h-10 items-center gap-1 text-[14px] font-bold text-[#DF0A14]"
        }
        style={romanBold}
      >
        Editions
        <span className="ml-1 text-[10px]" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div role="menu" aria-label="Editions" className="absolute left-0 top-full z-50 mt-2 w-[320px] border border-black/10 bg-[#F4F0EA] p-3 shadow-[0_18px_40px_rgba(10,10,10,0.08)]">
          {MENU_EDITIONS.map((edition, index) => (
            <div key={edition.id} className={index === 0 ? "" : "mt-3 border-t border-black/10 pt-3"}>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
                {edition.place}
              </p>
              <div className="mt-2 flex gap-3">
                <span className={`relative shrink-0 overflow-hidden bg-[#111] ${index === 0 ? "h-16 w-24" : "h-12 w-16"}`}>
                  <Image src={edition.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-4 text-[#1B1B1B]" style={roman}>
                    {edition.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-[0.06em] text-[#374151]" style={ui}>
                    {edition.when}
                  </span>
                  <span className={`mt-1 block italic text-[#1B1B1B] ${index === 0 ? "text-[15px] leading-5" : "text-[13px] leading-4"}`} style={roman}>
                    {edition.headline}
                  </span>
                  <button type="button" onClick={() => openEdition(edition.id)} className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#DF0A14]" style={uiBold}>
                    View
                  </button>
                </span>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onAll();
            }}
            className="mt-3 flex w-full border-t border-black/10 pt-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[#DF0A14]"
            style={uiBold}
          >
            View all
          </button>
        </div>
      ) : null}
    </div>
  );
}

function VersionNav({ current }: { current: "prototype" | "real" }) {
  const versions = [
    { id: "prototype" as const, href: "#top", label: "Prototype" },
    { id: "real" as const, href: "#top", label: "Real data" },
  ];
  const other = versions.find((version) => version.id !== current) ?? versions[0];
  return (
    <>
      <Link href={other.href} className="text-[12px] leading-none text-[#9CA3AF] hover:text-[#374151] hover:underline sm:hidden" style={ui}>
        {other.label}
      </Link>
      <nav aria-label="Version" className="hidden items-center gap-1.5 text-[12px] leading-none text-[#9CA3AF] sm:flex" style={ui}>
        {versions.map((version, index) => {
          const active = version.id === current;
          return (
            <span key={version.id} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden>·</span> : null}
              <Link
                href={version.href}
                aria-current={active ? "page" : undefined}
                className={active ? "text-[#6B7280]" : "hover:text-[#374151] hover:underline"}
              >
                {version.label}
              </Link>
            </span>
          );
        })}
        <span aria-hidden>·</span>
        <Link href="#top" className="hover:text-[#374151] hover:underline">
          Art direction and UX
        </Link>
      </nav>
    </>
  );
}

function WeekHeader({
  editionId,
  onEdition,
  access,
  onAccess,
  board,
  onBoard,
  hub,
  onHub,
  version,
}: {
  editionId: EditionId;
  onEdition: (id: EditionId) => void;
  access: MorningAccess;
  onAccess: (value: MorningAccess) => void;
  board: WeekBoard;
  onBoard: (value: WeekBoard) => void;
  hub: boolean;
  onHub: () => void;
  version: "prototype" | "real";
}) {
  return (
    <header className="relative z-30 bg-white">
      <div className="relative mx-auto grid h-[72px] max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-8 lg:h-[110px] lg:gap-6 lg:px-12 xl:px-20 2xl:px-[177px]">
        <a href="#" className="hidden items-center justify-self-start lg:flex">
          <span className="flex h-[51px] w-[52px] items-center justify-center bg-[#DF0A14] text-lg font-bold text-white">
            W
          </span>
          <span className="flex flex-col bg-white pl-[5px]">
            <span
              className="text-[12px] font-bold leading-[14px] text-[#DF0A14]"
              style={uiBold}
            >
              SUBSCRIBE &amp; SAVE
            </span>
            <span
              className="text-[11.4px] font-bold leading-[13px] text-[#333333]"
              style={uiBold}
            >
              Less than $2.50 per week
            </span>
          </span>
        </a>
        <div className="flex items-center gap-2 justify-self-start lg:hidden">
          <EditionsDropdown trigger="header" onEdition={onEdition} onAll={onHub} />
          <BriefingMenu
            editionId={editionId}
            onChange={onEdition}
            access={access}
            onAccess={onAccess}
            board={board}
            onBoard={onBoard}
            hub={hub}
            onHub={onHub}
          />
        </div>

        <WeekWordmark />

        <div className="flex items-center justify-self-end gap-3 lg:gap-5">
          <VersionNav current={version} />
          <div className="hidden lg:block">
            <BriefingMenu
              editionId={editionId}
              onChange={onEdition}
              access={access}
              onAccess={onAccess}
              board={board}
              onBoard={onBoard}
              hub={hub}
              onHub={onHub}
              align="end"
            />
          </div>
          <button
            type="button"
            className="hidden items-center gap-1 text-[12px] font-normal leading-[28px] text-[#333333] xl:flex"
            style={ui}
          >
            US Edition
            <UsFlag />
          </button>
          <button type="button" aria-label="Search" className="p-1 text-[#333]">
            <SearchIcon />
          </button>
          <a
            href="#"
            className="hidden h-10 items-center rounded border border-[#0A0A0A] px-[14px] py-3 text-[14px] font-bold uppercase leading-[20px] text-black lg:inline-flex"
            style={uiBold}
          >
            Sign in
            <UserIcon />
          </a>
          <a
            href="#"
            className="hidden h-[41px] items-center rounded bg-[#DF0A14] px-4 py-3 text-[14px] font-bold uppercase leading-4 text-white sm:inline-flex"
            style={uiBold}
          >
            Subscribe
          </a>
        </div>
      </div>

      <nav
        className="hidden h-[53px] items-center justify-center border-y border-[#E5E7EB] bg-white lg:flex"
        aria-label="The Week sections"
      >
        <div className="flex items-center">
          <EditionsDropdown trigger="nav" onEdition={onEdition} onAll={onHub} />
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="whitespace-nowrap px-5 text-[14px] font-bold leading-[20px] text-[#1F2937]"
              style={romanBold}
            >
              {item}
              {item === "More" ? (
                <span className="ml-1 inline-block text-[10px]" aria-hidden>
                  ▾
                </span>
              ) : null}
            </a>
          ))}
          <a
            href="#"
            className="ml-2 inline-flex h-[38px] items-center gap-[5px] rounded border border-[#D1D5DB] bg-[#FFE5E6] px-2 text-[14px] font-bold leading-[20px] text-[#1F2937]"
            style={romanBold}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#455E61] text-[10px] text-white">
              ★
            </span>
            The Week Recommends
          </a>
        </div>
      </nav>
    </header>
  );
}

function UsFlag() {
  return (
    <svg width="23" height="17" viewBox="0 0 23 17" aria-hidden className="ml-1">
      <rect width="23" height="17" fill="#BD3D44" />
      <rect y="1.3" width="23" height="1.3" fill="#fff" />
      <rect y="3.9" width="23" height="1.3" fill="#fff" />
      <rect y="6.5" width="23" height="1.3" fill="#fff" />
      <rect y="9.1" width="23" height="1.3" fill="#fff" />
      <rect y="11.7" width="23" height="1.3" fill="#fff" />
      <rect y="14.3" width="23" height="1.3" fill="#fff" />
      <rect width="10" height="9" fill="#192F5D" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="#333" strokeWidth="1.6" />
      <path d="M16 16.5 20 20.5" stroke="#333" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="ml-1.5"
      fill="none"
      aria-hidden
    >
      <circle cx="6" cy="3.5" r="2" stroke="#0A0A0A" strokeWidth="1.2" />
      <path
        d="M2 10c.4-2 2-3 4-3s3.6 1 4 3"
        stroke="#0A0A0A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function spyOffset(): number {
  const dropped = window.scrollY > 96;
  return (dropped ? READING_BAR : 0) + 28;
}

function storyIdAtScroll(stories: WeekStory[]): string {
  let current = stories[0]?.id ?? "";
  const offset = spyOffset();
  for (const story of stories) {
    const el = document.getElementById(story.id);
    if (el && el.getBoundingClientRect().top <= offset) {
      current = story.id;
    }
  }
  return current;
}

function BriefingMenu({
  editionId,
  onChange,
  access,
  onAccess,
  board,
  onBoard,
  hub,
  onHub,
  align = "start",
}: {
  editionId: EditionId;
  onChange: (id: EditionId) => void;
  access: MorningAccess;
  onAccess: (value: MorningAccess) => void;
  board: WeekBoard;
  onBoard: (value: WeekBoard) => void;
  hub: boolean;
  onHub: () => void;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-1 rounded border border-[#0A0A0A] px-[14px] text-[14px] font-bold uppercase leading-[20px] text-black"
        style={uiBold}
      >
        Dev controls
        <span className="text-[10px]" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Dev controls"
          className={`absolute top-full z-50 mt-2 min-w-[220px] border border-[#E5E7EB] bg-white py-1 ${align === "end" ? "right-0" : "left-0"}`}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onHub();
            }}
            className={`flex min-h-11 w-full items-center px-4 text-left text-[14px] font-bold leading-[20px] ${
              hub ? "text-[#DF0A14]" : "text-[#1F2937]"
            }`}
            style={romanBold}
          >
            Daily Editions
          </button>
          {BRIEFING_EDITIONS.map((edition) => {
            const active = !hub && edition.id === editionId;
            return (
              <button
                key={edition.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onChange(edition.id);
                }}
                className={`flex min-h-11 w-full items-center px-4 text-left text-[14px] font-bold leading-[20px] ${
                  active ? "text-[#DF0A14]" : "text-[#1F2937]"
                }`}
                style={romanBold}
              >
                {edition.label}
              </button>
            );
          })}
          {editionId === "morning" ? (
            <div className="border-t border-[#E5E7EB] py-1" role="group" aria-label="Morning Premium">
              <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]" style={uiBold}>
                Version
              </p>
              {MORNING_ACCESS.map((option) => {
                const active = access === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      onAccess(option.id);
                      setOpen(false);
                    }}
                    className={`flex min-h-11 w-full items-center px-4 text-left text-[14px] leading-5 ${
                      active ? "text-[#DF0A14]" : "text-[#1F2937]"
                    }`}
                    style={roman}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="border-t border-[#E5E7EB] py-1">
            {(
              [
                ["mobile", "Mobile board"],
                ["desktop", "Desktop · Redacted"],
                ["subscribe", "Page · Top 2"],
                ["direction", "Art direction"],
                ["convert", "Premium · Convert"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={board === id}
                onClick={() => {
                  onBoard(board === id ? "off" : id);
                  setOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`flex min-h-11 w-full items-center px-4 text-left text-[14px] leading-5 ${
                  board === id ? "text-[#DF0A14]" : "text-[#1F2937]"
                }`}
                style={roman}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="border-t border-[#E5E7EB] py-1" role="group" aria-label="Ads">
            <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]" style={uiBold}>
              Ads
            </p>
            {(
              [
                ["ad-1", "1 · You don’t have access yet"],
                ["ad-2", "2 · Unlock premium articles"],
                ["ad-3", "3 · Start reading today"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={board === id}
                onClick={() => {
                  onBoard(board === id ? "off" : id);
                  setOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`flex min-h-11 w-full items-center px-4 text-left text-[14px] leading-5 ${
                  board === id ? "text-[#DF0A14]" : "text-[#1F2937]"
                }`}
                style={roman}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StickyMedia({
  stories,
  activeId,
  onSelect,
  onExpand,
  gate = "open",
}: {
  stories: WeekStory[];
  activeId: string;
  onSelect: (id: string) => void;
  onExpand: (story: WeekStory) => void;
  gate?: MorningAccess;
}) {
  const activeIndex = Math.max(
    stories.findIndex((story) => story.id === activeId),
    0,
  );
  const progress = ((activeIndex + 1) / stories.length) * 100;
  const locked = gate !== "open";

  return (
    <div className="flex h-[calc(100dvh-52px-2.5rem-8px)] w-full flex-col bg-transparent">
      <div className="relative max-h-[380px] min-h-[200px] w-full flex-1 overflow-hidden bg-transparent">
        {stories.map((story, index) => {
          const hide = locked && index > 0;
          return (
          <div
            key={story.id}
            className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
              story.id === activeId ? "opacity-100" : "pointer-events-none opacity-0"
            } ${story.imageFit === "contain" ? "bg-white" : ""} ${hide ? "scale-105 blur-[12px]" : ""}`}
            style={
              story.imageSrc ? undefined : { background: story.imageGradient }
            }
            aria-hidden={story.id !== activeId}
          >
            {story.imageSrc ? (
              <button
                type="button"
                onClick={() => onExpand(story)}
                aria-label={`Expand image: ${story.imageCaption}`}
                tabIndex={story.id === activeId && !hide ? 0 : -1}
                className="absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={story.imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1440px) 720px, 40vw"
                  className={story.imageFit === "contain" ? "object-contain" : "object-cover"}
                />
                {locked ? null : (
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
                  style={uiBold}
                >
                  Expand
                </span>
                )}
              </button>
            ) : story.chip === "On this day" ? (
              <DatePlate story={story} />
            ) : (
              <div className="flex h-full items-end p-6">
                <p className="max-w-md text-3xl text-white" style={roman}>
                  {story.displayTitle}
                </p>
              </div>
            )}
          </div>
          );
        })}
        {locked && activeIndex > 0 ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DF0A14] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
              <Lock size={20} strokeWidth={2.4} aria-hidden />
              <span className="sr-only">Locked</span>
            </span>
          </div>
        ) : null}
      </div>

        {locked ? (
          <div className="mt-5 bg-[#F0EAE1]">
            <GateFile />
          </div>
        ) : null}
        {locked ? null : (
      <nav aria-label="Stories in this briefing" className="relative mt-4 shrink-0">
        <ol>
          {stories.map((story, index) => {
            const isActive = story.id === activeId;
            const isDone = index < activeIndex;
            return (
              <li key={story.id}>
                <button
                  type="button"
                  onClick={() => onSelect(story.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="flex w-full items-center gap-3 px-1 py-2 text-left"
                >
                  <span
                    className={`w-8 shrink-0 text-[15px] leading-5 ${
                      isActive || isDone ? "text-[#DF0A14]" : "text-[#9CA3AF]"
                    }`}
                    style={roman}
                  >
                    {storyNumber(index)}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className={`line-clamp-1 min-w-0 flex-1 text-[15px] leading-5 ${
                        isActive ? "text-black" : "text-[#4B5563]"
                      }`}
                      style={roman}
                    >
                      {story.menuTitle}
                    </span>
                    <StoryChip chip={story.chip} label={story.kicker} beside />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 h-px bg-[#E5E7EB]" aria-hidden>
          <div
            className="h-px bg-[#DF0A14] motion-reduce:transition-none transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>
        )}
    </div>
  );
}

function ReadingBar({
  stories,
  briefing,
  activeIndex,
  onSelect,
  access,
}: {
  stories: WeekStory[];
  briefing: string;
  activeIndex: number;
  onSelect: (id: string) => void;
  access?: MorningAccess;
}) {
  const [open, setOpen] = useState(false);
  const total = String(stories.length).padStart(2, "0");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 bg-white">
      <div className="mx-auto flex h-[52px] max-w-[1920px] items-center gap-3 border-b border-[#E5E7EB] px-4 sm:px-8 lg:px-8 xl:px-12 min-[1440px]:px-20">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em]">
            <li className="shrink-0">
              <a href="#top" className="text-[#DF0A14]" style={romanBold}>
                The Week
              </a>
            </li>
            <li aria-hidden className="shrink-0 text-[#9CA3AF]">
              /
            </li>
            <li className="shrink-0">
              <a href="#top" className="text-[#374151]" style={uiBold}>
                {briefing}
              </a>
            </li>
            <li aria-hidden className="shrink-0 text-[#9CA3AF]">
              /
            </li>
            <li aria-current="page" className="truncate text-black" style={uiBold}>
              {storyNumber(activeIndex)}/{total}
            </li>
          </ol>
        </nav>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="story-index"
          aria-label={open ? "Close stories" : "Open stories"}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-[20px] leading-none text-black lg:hidden"
        >
          {open ? "×" : "☰"}
        </button>
      </div>
      {open ? (
        <nav
          id="story-index"
          aria-label="Stories"
          className="max-h-[70vh] overflow-y-auto border-b border-[#E5E7EB] bg-white lg:hidden"
        >
          <ol className="mx-auto max-w-[720px] px-4 py-2 sm:px-8">
            {stories.map((story, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect(story.id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className="flex min-h-11 w-full items-start gap-4 py-2 text-left"
                  >
                    <span
                      className={`w-8 shrink-0 ${isActive ? "text-[#DF0A14]" : "text-[#9CA3AF]"}`}
                      style={roman}
                    >
                      {storyNumber(index)}
                    </span>
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="line-clamp-1 min-w-0 flex-1 text-[18px] leading-6 text-black" style={roman}>
                        {story.menuTitle}
                      </span>
                      {access && access !== "open" ? (
                        <Lock size={14} strokeWidth={2} aria-hidden className="shrink-0 text-[#6B7280]" />
                      ) : null}
                      <StoryChip chip={story.chip} label={story.kicker} beside />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}

const EDITION_HERO: Record<
  EditionId,
  { kicker: string; title: [string, string]; ground: string; ink: string; image: string }
> = {
  morning: {
    kicker: "Weekdays",
    title: ["Morning", "Report"],
    ground: "#83C8C5",
    ink: "#0A0A0A",
    image: "/the-week/hero-morning-field.jpg",
  },
  evening: {
    kicker: "Weekdays",
    title: ["Evening", "Review"],
    ground: "#1254A8",
    ink: "#FFFFFF",
    image: "/the-week/hero-evening-field.jpg",
  },
  saturday: {
    kicker: "Every Saturday",
    title: ["Saturday", "Wrap"],
    ground: "#75C298",
    ink: "#0A0A0A",
    image: "/the-week/hero-saturday-field.jpg",
  },
  sunday: {
    kicker: "Every Sunday",
    title: ["Sunday", "Shortlist"],
    ground: "#F67B76",
    ink: "#0A0A0A",
    image: "/the-week/hero-sunday-field.jpg",
  },
  all: {
    kicker: "Every edition",
    title: ["The", "Week"],
    ground: "#111111",
    ink: "#FFFFFF",
    image: "",
  },
};

function EditionHero({
  edition,
  stories,
  fill = false,
  access,
}: {
  edition: WeekEdition;
  stories: WeekStory[];
  fill?: boolean;
  access?: MorningAccess;
}) {
  const theme = EDITION_HERO[edition.id];
  const lead = stories[0];
  const chips = [...new Set(stories.map((story) => story.chip))].slice(0, 5);
  const panels: EditionId[] = ["morning", "evening", "saturday", "sunday"];
  const title =
    edition.id === "morning" && access && access !== "open"
      ? (["Morning", "Premium"] as [string, string])
      : theme.title;

  const scrim = (solid: string, fade: string) =>
    `linear-gradient(90deg, ${theme.ground} 0%, ${theme.ground} ${solid}, transparent ${fade})`;

  const copy = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center bg-[#DF0A14] text-[12px] font-bold text-white">
          W
        </span>
        <span className="text-[12px] font-bold tracking-[0.28em]" style={romanBold}>
          THE WEEK
        </span>
      </div>
      <div>
        <p data-rise="0.45" className="text-[11px] font-bold uppercase tracking-[0.18em]" style={uiBold}>
          {theme.kicker}
        </p>
        <h1 data-rise="0.75" className="mt-1 text-[40px] leading-[0.9] sm:text-[48px] lg:text-[56px] xl:text-[64px]" style={roman}>
          <span className="block">{title[0]}</span>
          <span className="block italic">{title[1]}</span>
        </h1>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={uiBold}>
          Lead story
        </p>
        <p data-rise="1" className="mt-1 text-[15px] leading-5 lg:whitespace-nowrap lg:text-[16px]" style={roman}>
          {lead.dek}
        </p>
        {access === "blur" ? (
          <p className="mt-3 max-w-[34ch] text-[15px] leading-5" style={roman}>
            We read the news so you don’t have to.
          </p>
        ) : null}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip}>
              <span
                className="inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-[10px] font-bold uppercase leading-none tracking-[0.06em]"
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontWeight: 700,
                  background: typeWash(chip),
                  color: typeInk(chip),
                }}
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: typeInk(chip) }} />
                {chip}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (fill) {
    return (
      <section className="flex h-full flex-col overflow-hidden" style={{ background: theme.ground, color: theme.ink }}>
        <div className="flex shrink-0 flex-col justify-start gap-2 px-4 pb-3 pt-4">
          {copy}
        </div>
        <div className="relative min-h-[46%] flex-1">
          {theme.image ? (
            <Image
              src={theme.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden ${fill ? "h-full" : ""}`}
      style={{ background: theme.ground, color: theme.ink }}
    >
      {theme.image ? (
        <div className="absolute inset-0 lg:hidden" aria-hidden>
          <Image
            src={theme.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 md:hidden" style={{ background: scrim("58%", "100%") }} />
          <div className="absolute inset-0 hidden md:block" style={{ background: scrim("40%", "78%") }} />
        </div>
      ) : null}
      <div className={`grid w-full lg:min-h-[380px] lg:grid-cols-2 ${fill ? "h-full" : ""}`}>
        <div className="relative z-10 flex flex-col justify-center gap-5 px-4 py-6 sm:px-8 md:py-7 lg:gap-6 lg:py-8 lg:pl-8 lg:pr-8 xl:pl-12 min-[1440px]:pl-20 2xl:pl-[177px]">
          {copy}
        </div>
        <div className="relative hidden lg:block">
          {theme.image ? (
            <Image
              src={theme.image}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover object-right"
            />
          ) : (
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {panels.map((id) => (
                <div key={id} className="relative">
                  <Image src={EDITION_HERO[id].image} alt="" fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type ArchiveKind = Exclude<EditionId, "all">;

type ArchiveCard = {
  id: string;
  editionId: ArchiveKind;
  day: number;
  weekday: string;
  month: string;
  headline: string;
  more: number;
  topics: string;
  image: string;
};

const EDITION_PROMISE: Record<ArchiveKind, string> = {
  morning: "The day, from the papers, before it runs away.",
  evening: "What still holds, once the day has happened.",
  saturday: "The week, read once.",
  sunday: "What is worth your time next.",
};

const ARCHIVE_LABEL: Record<ArchiveKind, string> = {
  morning: "Morning Report",
  evening: "Evening Review",
  saturday: "Saturday Wrap",
  sunday: "Sunday Shortlist",
};

const ARCHIVE_FILTERS: { id: EditionId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "morning", label: "Morning" },
  { id: "evening", label: "Evening" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const ARCHIVE_WEEKS: { label: string; range: string; editions: ArchiveCard[] }[] = [
  {
    label: "This Week",
    range: "5–11 October · 12 editions",
    editions: [
      { id: "oct11-sun", editionId: "sunday", day: 11, weekday: "Sun", month: "October", headline: "What we lose when local news disappears", more: 8, topics: "International · Legal · Perspectives · The Long Read · The Week Recommends", image: "/the-week/hero-sunday-field.jpg" },
      { id: "oct10-sat", editionId: "saturday", day: 10, weekday: "Sat", month: "October", headline: "The week the shutdown clock ran out", more: 8, topics: "Climate · Business · The Week in Cartoons · Good Week / Bad Week · The Big Picture", image: "/the-week/hero-saturday-field.jpg" },
      { id: "oct9-pm", editionId: "evening", day: 9, weekday: "Fri", month: "October", headline: "Markets close the week still arguing", more: 8, topics: "Business · Culture · Picture of the Day · Commentary · What to Watch", image: "/the-week/six-flags.jpg" },
      { id: "oct9-am", editionId: "morning", day: 9, weekday: "Fri", month: "October", headline: "The jobs number nobody wanted", more: 8, topics: "Economy · Politics · The Big Question · Statistic of the Day · What to Watch", image: "/the-week/lithuania.jpg" },
      { id: "oct8-pm", editionId: "evening", day: 8, weekday: "Thu", month: "October", headline: "A chip export rule splits the allies", more: 8, topics: "Business · Tech · Under the Radar · Speed Reads · What to Watch", image: "/the-week/spies.png" },
      { id: "oct8-am", editionId: "morning", day: 8, weekday: "Thu", month: "October", headline: "Congress finds a shutdown off-ramp", more: 8, topics: "Politics · Business · Speed Reads · Quote of the Day · Under the Radar", image: "/the-week/cornell.jpg" },
      { id: "oct7-pm", editionId: "evening", day: 7, weekday: "Wed", month: "October", headline: "A ceasefire holds, barely, through the night", more: 8, topics: "Business · Tech · Poll Watch · Picture of the Day · Commentary", image: "/the-week/camp-david.jpg" },
      { id: "oct7-am", editionId: "morning", day: 7, weekday: "Wed", month: "October", headline: "The governor everyone is suddenly watching", more: 8, topics: "Climate · Business · Puzzles · In the Spotlight · Statistic of the Day", image: "/the-week/texas.jpg" },
      { id: "oct6-pm", editionId: "evening", day: 6, weekday: "Tues", month: "October", headline: "Shutdown brinkmanship goes to the wire", more: 8, topics: "Business · Tech · Under the Radar · Speed Reads · What to Watch", image: "/the-week/meeting-place.jpg" },
      { id: "oct6-am", editionId: "morning", day: 6, weekday: "Tues", month: "October", headline: "A tariff memo rattles Europe", more: 12, topics: "Middle East · International · Speed Reads · Quote of the Day · Under the Radar", image: "/the-week/diplomat.jpg" },
      { id: "oct5-pm", editionId: "evening", day: 5, weekday: "Mon", month: "October", headline: "Is the AI boom a bubble — or just getting started?", more: 8, topics: "Business · Tech · Poll Watch · Picture of the Day · Commentary", image: "/the-week/hero-evening-field.jpg" },
      { id: "oct5-am", editionId: "morning", day: 5, weekday: "Mon", month: "October", headline: "Will the justices rein in presidential power?", more: 8, topics: "Tech · Culture · The Big Question · Statistic of the Day · What to Watch", image: "/the-week/pike.jpg" },
    ],
  },
  {
    label: "Last week",
    range: "28 Sep–4 October · 12 editions",
    editions: [
      { id: "oct4-sun", editionId: "sunday", day: 4, weekday: "Sun", month: "October", headline: "A long read on the papers that closed", more: 8, topics: "International · Legal · Perspectives · The Long Read · The Week Recommends", image: "/the-week/section-viewpoint.jpg" },
      { id: "oct3-sat", editionId: "saturday", day: 3, weekday: "Sat", month: "October", headline: "Cartoons, and the week they were drawn for", more: 8, topics: "Climate · Business · The Week in Cartoons · Good Week / Bad Week · The Big Picture", image: "/the-week/cartoon-oct15.jpg" },
      { id: "oct2-pm", editionId: "evening", day: 2, weekday: "Fri", month: "October", headline: "The weekend briefing starts early", more: 7, topics: "Culture · Business · Picture of the Day · Commentary · What to Watch", image: "/the-week/stallone.jpg" },
      { id: "oct2-am", editionId: "morning", day: 2, weekday: "Fri", month: "October", headline: "Friday’s front pages argue past each other", more: 8, topics: "Politics · Culture · The Big Question · Statistic of the Day · What to Watch", image: "/the-week/section-newspapers.jpg" },
      { id: "oct1-pm", editionId: "evening", day: 1, weekday: "Thu", month: "October", headline: "Tech earnings, and the questions after them", more: 8, topics: "Business · Tech · Poll Watch · Picture of the Day · Commentary", image: "/the-week/cajun.jpg" },
      { id: "oct1-am", editionId: "morning", day: 1, weekday: "Thu", month: "October", headline: "A new month, the same funding fight", more: 8, topics: "Politics · Economy · Speed Reads · Quote of the Day · Under the Radar", image: "/the-week/lithuania.jpg" },
      { id: "sep30-pm", editionId: "evening", day: 30, weekday: "Wed", month: "September", headline: "The quarter ends with a shrug from Wall Street", more: 8, topics: "Business · Tech · Under the Radar · Speed Reads · What to Watch", image: "/the-week/millionaire.jpg" },
      { id: "sep30-am", editionId: "morning", day: 30, weekday: "Wed", month: "September", headline: "Storm forecasts move the weekend plans", more: 8, topics: "Climate · Business · Puzzles · In the Spotlight · Statistic of the Day", image: "/the-week/okinawa.webp" },
      { id: "sep29-pm", editionId: "evening", day: 29, weekday: "Tues", month: "September", headline: "A verdict, and the appeals already drafted", more: 8, topics: "Legal · Politics · Speed Reads · Commentary · Under the Radar", image: "/the-week/guilfoyle.jpg" },
      { id: "sep29-am", editionId: "morning", day: 29, weekday: "Tues", month: "September", headline: "The speaker’s margin gets thinner", more: 9, topics: "Politics · International · The Big Question · Statistic of the Day · What to Watch", image: "/the-week/pope.jpg" },
      { id: "sep28-pm", editionId: "evening", day: 28, weekday: "Mon", month: "September", headline: "Oil jumps, then thinks better of it", more: 8, topics: "Business · Tech · Poll Watch · Picture of the Day · Commentary", image: "/the-week/elnino.jpg" },
      { id: "sep28-am", editionId: "morning", day: 28, weekday: "Mon", month: "September", headline: "A budget leak sets the week’s argument", more: 8, topics: "Politics · Business · Speed Reads · Quote of the Day · Under the Radar", image: "/the-week/hastert.jpg" },
    ],
  },
];

function ArchiveEditionCard({
  card,
  onOpen,
}: {
  card: ArchiveCard;
  onOpen: (id: ArchiveKind) => void;
}) {
  return (
    <article className="w-[78%] max-w-[283px] shrink-0 snap-start">
      <button type="button" onClick={() => onOpen(card.editionId)} className="block w-full text-left">
        <div className="relative aspect-square overflow-hidden bg-[#111]">
          <Image src={card.image} alt="" fill sizes="283px" className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col p-3 text-[#F9FAFB]">
            <p className="text-[15px] uppercase leading-6 tracking-[0.04em]" style={ui}>
              {ARCHIVE_LABEL[card.editionId]}
            </p>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-[96px] leading-none sm:text-[128px] sm:leading-[117px]" style={roman}>
                {card.day}
              </p>
              <p className="text-[16px] leading-6" style={roman}>
                {card.weekday} · {card.month}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <p className="text-[16px] uppercase leading-6 text-[#4B5563]" style={ui}>
              top story
            </p>
            <p className="mt-[7px] min-h-[52px] text-[20px] leading-[26px] text-black" style={roman}>
              {card.headline}
            </p>
          </div>
          <div className="h-px w-full bg-[#9CA3AF]" />
          <div>
            <p className="text-[16px] leading-6 text-black" style={roman}>
              + {card.more} more inside
            </p>
            <p className="mt-1.5 text-[16px] leading-6 text-[#4B5563]" style={roman}>
              {card.topics}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}

function EditionsHubLink({ onHub, compact = false }: { onHub: () => void; compact?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-5 border-b border-black/15 ${
        compact ? "pb-8" : "pb-10 sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
          Daily Editions
        </p>
        <h2
          className={
            compact
              ? "mt-2 text-[32px] leading-9 text-black"
              : "mt-2 text-[40px] leading-[48px] text-black lg:text-[48px] lg:leading-[56px]"
          }
          style={roman}
        >
          Back to today’s editions
        </h2>
        <p className="mt-2 max-w-[42ch] text-[16px] leading-6 text-black" style={roman}>
          Morning Report, Evening Review, Saturday Wrap and Sunday Shortlist, in one place.
        </p>
      </div>
      <button
        type="button"
        onClick={onHub}
        className="inline-flex h-12 shrink-0 items-center justify-center bg-[#0A0A0A] px-5 text-[14px] font-bold uppercase tracking-[0.04em] text-white"
        style={uiBold}
      >
        All daily editions
      </button>
    </div>
  );
}

function PreviousEditions({
  onEdition,
  onHub,
  compact = false,
}: {
  onEdition: (id: EditionId) => void;
  onHub?: () => void;
  compact?: boolean;
}) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [filter, setFilter] = useState<EditionId>("all");
  const rowRef = useRef<HTMLDivElement>(null);
  const week = ARCHIVE_WEEKS[weekIndex];
  const cards = week.editions.filter((card) => filter === "all" || card.editionId === filter);

  useEffect(() => {
    rowRef.current?.scrollTo({ left: 0 });
  }, [weekIndex, filter]);

  return (
    <section className={`flex flex-col ${compact ? "gap-10 pb-10" : "gap-[60px]"}`} aria-label="Previous editions">
      {onHub ? <EditionsHubLink onHub={onHub} compact={compact} /> : null}
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-[90px]">
          <h2
            className={compact ? "text-[36px] leading-10 text-black" : "text-[40px] leading-[48px] text-black lg:text-[60px] lg:leading-[72px]"}
            style={roman}
          >
            Previous editions
          </h2>
          <div className="flex flex-wrap items-start gap-x-[30px] gap-y-3 lg:flex-1" role="group" aria-label="Edition">
            {ARCHIVE_FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className="flex flex-col items-start gap-[5px]"
                >
                  <span className="text-[16px] leading-6 text-[#4B5563]" style={ui}>
                    {item.label}
                  </span>
                  <span className={`h-[3px] w-full ${active ? "bg-[#DF0A14]" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-[15px]">
          <button
            type="button"
            aria-label="Previous week"
            disabled={weekIndex >= ARCHIVE_WEEKS.length - 1}
            onClick={() => setWeekIndex((index) => Math.min(ARCHIVE_WEEKS.length - 1, index + 1))}
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border border-black text-black disabled:opacity-30"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <div className="flex flex-wrap items-end justify-center gap-x-[15px] gap-y-0">
            <p className="text-[20px] leading-[26px] text-black" style={roman}>
              {week.label}
            </p>
            <p className="text-[18px] leading-6 text-[#4B5563]" style={roman}>
              {week.range}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next week"
            disabled={weekIndex === 0}
            onClick={() => setWeekIndex((index) => Math.max(0, index - 1))}
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border border-black text-black disabled:opacity-30"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
        <div
          ref={rowRef}
          data-editions-row
          className="flex snap-x snap-mandatory gap-[29px] overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [scrollbar-width:thin] [touch-action:pan-x]"
        >
          {cards.map((card) => (
            <ArchiveEditionCard key={card.id} card={card} onOpen={onEdition} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[30px]">
        <div className="h-0.5 w-full bg-[#DF0A14]" />
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 sm:gap-[62px]">
            <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden sm:h-[166px] sm:w-[166px]">
              <Image
                src="/the-week/section-newspapers.jpg"
                alt=""
                fill
                sizes="166px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] uppercase leading-6 text-[#DF0A14]" style={ui}>
                From the Magazine
              </p>
              <p className="mt-[5px] text-[24px] leading-8 text-black sm:text-[28px] sm:leading-9" style={romanBold}>
                This week’s issue of The Week
              </p>
              <p className="mt-[7px] max-w-[36ch] text-[18px] leading-6 text-black" style={roman}>
                Read the digital magazine and past issues online or in The Week app.
              </p>
            </div>
          </div>
          <a
            href="https://theweek.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center rounded bg-[#DF0A14] px-4 text-[16px] font-bold uppercase leading-6 text-[#FAFAFA]"
            style={uiBold}
          >
            Read the digital magazine
          </a>
        </div>
      </div>
    </section>
  );
}

function DailyEditionsHub({ onEdition }: { onEdition: (id: EditionId) => void }) {
  return (
    <div className="mx-auto max-w-[1920px] px-4 py-10 sm:px-8 lg:px-12 xl:px-20 2xl:px-[177px]">
      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
        Daily Editions
      </p>
      <h1 className="mt-3 max-w-[14ch] text-[48px] leading-[0.95] text-black lg:text-[64px]" style={roman}>
        Today’s reports and reviews
      </h1>
      <p className="mt-4 max-w-[42ch] text-[18px] leading-7 text-black" style={roman}>
        We read the news so you don’t have to. The opening is the point. Under it, how the story was covered. We don’t tell you what to think.
      </p>
      <ul className="mt-6 flex max-w-[720px] flex-col gap-2 sm:flex-row sm:gap-8">
        {[
          ["01", "Four editions, each with a job"],
          ["02", "The point, then the coverage"],
          ["03", "No instruction on what to think"],
        ].map(([n, line]) => (
          <li key={n} className="flex items-baseline gap-2 text-[15px] leading-5 text-[#1B1B1B]" style={roman}>
            <span className="text-[#DF0A14]">{n}</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {BRIEFING_EDITIONS.map((edition) => {
          const theme = EDITION_HERO[edition.id];
          const lead = edition.stories[0];
          return (
            <li key={edition.id}>
              <button type="button" onClick={() => onEdition(edition.id)} className="flex h-full w-full flex-col text-left">
                <span className="relative block aspect-[4/3] overflow-hidden" style={{ background: theme.ground }}>
                  {theme.image ? (
                    <Image src={theme.image} alt="" fill sizes="420px" className="object-cover" />
                  ) : null}
                </span>
                <span className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#DF0A14]" style={uiBold}>
                  {theme.kicker}
                </span>
                <span className="mt-1 text-[28px] leading-8 text-black" style={roman}>
                  {edition.briefing}
                </span>
                <span className="mt-2 text-[16px] leading-6 text-[#1B1B1B]" style={roman}>
                  {EDITION_PROMISE[edition.id as ArchiveKind]}
                </span>
                <span className="mt-2 text-[16px] leading-6 text-[#374151]" style={roman}>
                  {lead.dek}
                </span>
                <span className="mt-4 text-[13px] font-bold uppercase tracking-[0.06em] text-[#DF0A14]" style={uiBold}>
                  Read {edition.briefing}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-16">
        <PreviousEditions onEdition={onEdition} />
      </div>
    </div>
  );
}

function CaughtUp({
  edition,
  onEdition,
  className,
}: {
  edition: WeekEdition;
  onEdition: (id: EditionId) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="max-w-[65ch] border-t border-black/15 pt-12">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
          {edition.briefing}
        </p>
        <h2 className="mt-4 text-[40px] leading-[46px] text-black" style={roman}>
          You’re all caught up.
        </h2>
        <p className="mt-4 text-[20px] leading-7 text-black" style={roman}>
          {edition.caughtUp}
        </p>
        <div className="mt-8 flex flex-col items-start gap-1">
          {EDITIONS.filter((item) => item.id !== edition.id).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onEdition(item.id)}
              className="inline-flex min-h-11 items-center text-[16px] text-black underline decoration-[#DF0A14] underline-offset-4"
              style={roman}
            >
              {item.briefing}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCoverCopy({
  story,
  index,
  total,
  ink,
  locked = false,
}: {
  story: WeekStory;
  index: number;
  total: number;
  ink: string;
  locked?: boolean;
}) {
  return (
    <>
      <p
        data-rise="0.5"
        className="inline-flex w-fit max-w-full items-center gap-2 px-1.5 py-1 text-[12px] font-bold uppercase leading-4 text-white"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 700,
          background: typeInk(story.chip),
        }}
      >
        <span>{storyNumber(index)}</span>
        <span>{story.kicker}</span>
        {locked ? <Lock size={12} strokeWidth={2.4} aria-hidden /> : null}
      </p>
      <h2 data-rise="1" className="mt-2 text-[34px] leading-[38px]" style={{ ...roman, color: ink }}>
        {story.dek}
      </h2>
      <p
        data-rise="1.35"
        className="mt-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em]"
        style={{ ...uiBold, color: ink }}
      >
        <span className="inline-flex items-center gap-1">
          Scroll down for next story
          <ChevronDown size={14} aria-hidden />
        </span>
        <span>
          {storyNumber(index)} / {String(total).padStart(2, "0")}
        </span>
      </p>
    </>
  );
}

function reduceMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function updateReelMotion(feed: HTMLElement): void {
  const reduce = reduceMotion();
  const height = feed.clientHeight || 1;
  feed.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
    const progress = (card.offsetTop - feed.scrollTop) / height;
    const sheet = card.querySelector<HTMLElement>("[data-sheet]");
    const y = sheet?.scrollTop ?? 0;
    const copy = card.querySelector<HTMLElement>("[data-copy]");
    if (copy) {
      const sheetFade = Math.max(0, 1 - y / 180);
      const settle = Math.max(0, 1 - Math.abs(progress) * 0.85);
      copy.style.opacity = reduce ? "" : String(Math.max(0, Math.min(1, settle * sheetFade)));
    }
    card.querySelectorAll<HTMLElement>("[data-rise]").forEach((line) => {
      if (reduce) {
        line.style.transform = "";
        return;
      }
      const factor = Number(line.dataset.rise || "1");
      const shift = progress * 120 * factor - y * 0.82 * factor;
      line.style.transform = `translate3d(0, ${shift}px, 0)`;
    });
    const photo = card.querySelector<HTMLElement>("[data-photo]");
    if (photo) {
      photo.style.transform = reduce ? "" : `scale(${1 + Math.min(y, 420) / 2600})`;
    }
  });
}

function MobileStory({
  story,
  stories,
  index,
  total,
  onEdge,
  onFrame,
  access,
}: {
  story: WeekStory;
  stories: WeekStory[];
  index: number;
  total: number;
  onEdge: (direction: 1 | -1) => void;
  onFrame: () => void;
  access: MorningAccess;
}) {
  const contained = story.imageFit === "contain";
  const hidePhoto = access !== "open" && index > 0;
  const sheetRef = useRef<HTMLDivElement>(null);
  const onEdgeRef = useRef(onEdge);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onEdgeRef.current = onEdge;
    onFrameRef.current = onFrame;
  }, [onEdge, onFrame]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    let startY = 0;
    let startT = 0;
    let atTop = false;
    let atBottom = false;
    let wheelLock = 0;

    const onStart = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
      startT = Date.now();
      atTop = sheet.scrollTop <= 1;
      atBottom = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 2;
    };
    const onMove = (event: TouchEvent) => {
      const dy = startY - event.touches[0].clientY;
      const speed = Math.abs(dy) / Math.max(Date.now() - startT, 1);
      if (atTop && dy > 14 && speed > 0.75) event.preventDefault();
    };
    const onEnd = (event: TouchEvent) => {
      const dy = startY - event.changedTouches[0].clientY;
      const speed = Math.abs(dy) / Math.max(Date.now() - startT, 1);
      if (atTop && dy > 56 && speed > 0.75) {
        sheet.scrollTo({ top: 0 });
        onEdgeRef.current(1);
        return;
      }
      if (atTop && dy < -56 && speed > 0.45) {
        onEdgeRef.current(-1);
        return;
      }
      if (atBottom && dy > 40 && speed > 0.35) onEdgeRef.current(1);
    };
    const onWheel = (event: WheelEvent) => {
      const atTopNow = sheet.scrollTop <= 1;
      const atBottomNow = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 2;
      const now = Date.now();
      if (now < wheelLock) {
        if ((atTopNow && event.deltaY < 0) || (atBottomNow && event.deltaY > 0)) event.preventDefault();
        return;
      }
      if (atTopNow && event.deltaY < -8) {
        event.preventDefault();
        wheelLock = now + 480;
        onEdgeRef.current(-1);
      } else if (atBottomNow && event.deltaY > 8) {
        event.preventDefault();
        wheelLock = now + 480;
        onEdgeRef.current(1);
      } else if (atTopNow && event.deltaY > 70) {
        event.preventDefault();
        sheet.scrollTo({ top: 0 });
        wheelLock = now + 480;
        onEdgeRef.current(1);
      }
    };
    const onScroll = () => onFrameRef.current();

    sheet.addEventListener("touchstart", onStart, { passive: true });
    sheet.addEventListener("touchmove", onMove, { passive: false });
    sheet.addEventListener("touchend", onEnd);
    sheet.addEventListener("wheel", onWheel, { passive: false });
    sheet.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      sheet.removeEventListener("touchstart", onStart);
      sheet.removeEventListener("touchmove", onMove);
      sheet.removeEventListener("touchend", onEnd);
      sheet.removeEventListener("wheel", onWheel);
      sheet.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <article
      id={`m-${story.id}`}
      data-card
      className={`relative h-full shrink-0 snap-start snap-always overflow-hidden ${
        contained ? "bg-[#F4F0EA]" : "bg-black"
      }`}
    >
      <div data-photo className="absolute inset-0">
        <div className={hidePhoto ? "absolute inset-0 scale-105 blur-[18px]" : "absolute inset-0"}>
          {story.imageSrc ? (
            <Image
              src={story.imageSrc}
              alt=""
              fill
              sizes="100vw"
              className={contained ? "object-contain" : "object-cover"}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: story.imageGradient }} />
          )}
        </div>
      </div>
      {contained ? null : (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      )}
      {hidePhoto ? (
        <div className="pointer-events-none absolute inset-x-0 top-[22%] z-10 flex justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#DF0A14] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            <Lock size={22} strokeWidth={2.4} aria-hidden />
            <span className="sr-only">Locked</span>
          </span>
        </div>
      ) : null}
      <div data-copy className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-8">
        <StoryCoverCopy
          story={story}
          index={index}
          total={total}
          ink={contained ? "#0A0A0A" : "#FFFFFF"}
          locked={access !== "open"}
        />
      </div>
      <div
        ref={sheetRef}
        data-sheet
        className="absolute inset-0 z-20 overflow-x-hidden overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="h-full" />
        <div className="min-h-full bg-[#F4F0EA] px-5 pb-16 pt-8 text-black shadow-[0_-18px_40px_rgba(0,0,0,0.28)]">
          {story.imageCaption ? (
            <p className="max-w-[65ch] text-[13px] leading-5 text-[#4B5563]" style={ui}>
              {story.imageCaption}
            </p>
          ) : null}
          <div className={`flex flex-col gap-12 ${story.imageCaption ? "mt-8" : ""}`}>
            <GatedStoryBody story={story} access={access} lead={index === 0} showHeader />
          </div>
          {index === total - 1 ? <EditionSources stories={stories} /> : null}
          {index < total - 1 ? (
            <p
              className="mt-14 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]"
              style={uiBold}
            >
              Scroll down for next story
              <ChevronDown size={14} aria-hidden />
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface MobileReading {
  scrolled: boolean;
  index: number;
  progress: number;
  archive: boolean;
}

function readMobileFeed(feed: HTMLElement, storyCount: number): MobileReading {
  const height = feed.clientHeight || 1;
  const cards = [...feed.querySelectorAll<HTMLElement>("[data-card]")];
  let active = cards[0];
  for (const card of cards) {
    if (card.offsetTop - feed.scrollTop <= height * 0.4) active = card;
  }
  const articles = cards.filter((card) => card.tagName === "ARTICLE");
  let index = 0;
  for (let i = 0; i < articles.length; i += 1) {
    if (articles[i].offsetTop - feed.scrollTop <= height * 0.4) index = i;
  }
  index = Math.min(index, Math.max(storyCount - 1, 0));
  const sheet = articles[index]?.querySelector<HTMLElement>("[data-sheet]");
  const sheetRoom = sheet ? Math.max(sheet.scrollHeight - sheet.clientHeight, 0) : 0;
  const sheetPart = sheet && sheetRoom > 0 ? sheet.scrollTop / sheetRoom : 0;
  const max = Math.max(feed.scrollHeight - height, 1);
  const span = max + (sheetRoom > 0 ? height : 0);
  const progress = Math.min(1, Math.max(0, (feed.scrollTop + sheetPart * (sheetRoom > 0 ? height : 0)) / span));
  return {
    scrolled: feed.scrollTop > height * 0.55 && !active?.hasAttribute("data-archive"),
    index,
    progress,
    archive: Boolean(active?.hasAttribute("data-archive")),
  };
}

function feedAllowsSideSwipe(feed: HTMLElement): boolean {
  const top = feed.scrollTop;
  const cards = feed.querySelectorAll<HTMLElement>("[data-card]");
  for (const card of cards) {
    if (Math.abs(card.offsetTop - top) > 48) continue;
    if (card.hasAttribute("data-archive")) return false;
    const sheet = card.querySelector<HTMLElement>("[data-sheet]");
    if (!sheet) return true;
    return sheet.scrollTop < 24;
  }
  return true;
}

function MobileBoardStory({
  story,
  stories,
  index,
  total,
  access,
}: {
  story: WeekStory;
  stories: WeekStory[];
  index: number;
  total: number;
  access: MorningAccess;
}) {
  const contained = story.imageFit === "contain";
  const hidePhoto = access !== "open" && index > 0;
  return (
    <article className={contained ? "bg-[#F4F0EA]" : "bg-black"}>
      <div className="relative h-[700px] overflow-hidden">
        <div className={hidePhoto ? "absolute inset-0 scale-105 blur-[18px]" : "absolute inset-0"}>
          {story.imageSrc ? (
            <Image
              src={story.imageSrc}
              alt=""
              fill
              sizes="390px"
              className={contained ? "object-contain" : "object-cover"}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: story.imageGradient }} />
          )}
        </div>
        {contained ? null : (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        )}
        {hidePhoto ? (
          <div className="pointer-events-none absolute inset-x-0 top-[22%] flex justify-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#DF0A14] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
              <Lock size={22} strokeWidth={2.4} aria-hidden />
            </span>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-8">
          <StoryCoverCopy
            story={story}
            index={index}
            total={total}
            ink={contained ? "#0A0A0A" : "#FFFFFF"}
            locked={access !== "open"}
          />
        </div>
      </div>
      <div className="bg-[#F4F0EA] px-5 py-8 text-black">
        {story.imageCaption ? (
          <p className="max-w-[65ch] text-[13px] leading-5 text-[#4B5563]" style={ui}>
            {story.imageCaption}
          </p>
        ) : null}
        <div className={story.imageCaption ? "mt-8" : ""}>
          <GatedStoryBody story={story} access={access} lead={index === 0} showHeader />
        </div>
        {index === total - 1 ? <EditionSources stories={stories} /> : null}
      </div>
    </article>
  );
}

function MobileBoard({
  edition,
  stories,
  access,
  onEdition,
}: {
  edition: WeekEdition;
  stories: WeekStory[];
  access: MorningAccess;
  onEdition: (id: EditionId) => void;
}) {
  const gate = edition.id === "morning" ? access : "open";
  return (
    <div className="bg-[#C8C2B8] px-4 py-8">
      <div className="mx-auto w-[390px] overflow-hidden bg-black shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="h-[780px]">
          <EditionHero edition={edition} stories={stories} fill access={gate} />
        </div>
        {stories.map((story, index) => (
          <MobileBoardStory
            key={story.id}
            story={story}
            stories={stories}
            index={index}
            total={stories.length}
            access={gate}
          />
        ))}
        {gate === "open" ? (
          <CaughtUp
            edition={edition}
            onEdition={onEdition}
            className="bg-[#F4F0EA] px-6 py-16"
          />
        ) : null}
        <div className="bg-[#F4F0EA] px-4 py-8">
          <PreviousEditions onEdition={onEdition} compact />
        </div>
      </div>
    </div>
  );
}

const DIRECTION_COLOURS = [
  { name: "Cream", hex: CREAM, note: "Page" },
  { name: "Warm", hex: WARM, note: "Alternate story" },
  { name: "Ink", hex: "#0A0A0A", note: "Headlines" },
  { name: "Body", hex: "#374151", note: "Reading text" },
  { name: "Red", hex: WEEK_RED, note: "Rules, numbers, subscribe" },
  { name: "Teal", hex: WEEK_TEAL, note: "Explainers, people" },
  { name: "Blue", hex: WEEK_BLUE, note: "Statistics, quotes" },
  { name: "Slate", hex: WEEK_SLATE, note: "Pictures, puzzles" },
];

const DIRECTION_EDITIONS = [
  { name: "Morning", hex: "#83C8C5", ink: "#0A0A0A", image: "/the-week/hero-morning-field.jpg" },
  { name: "Evening", hex: "#1254A8", ink: "#FFFFFF", image: "/the-week/hero-evening-field.jpg" },
  { name: "Saturday", hex: "#75C298", ink: "#0A0A0A", image: "/the-week/hero-saturday-field.jpg" },
  { name: "Sunday", hex: "#F67B76", ink: "#0A0A0A", image: "/the-week/hero-sunday-field.jpg" },
];

const DIRECTION_PICTURES = [
  { src: "/the-week/hero-morning-field.jpg", label: "Field hero", caption: "One colour, then the picture." },
  { src: "/the-week/pike.jpg", label: "News picture", caption: "Full-bleed, caption underneath." },
  { src: "/the-week/section-newspapers.jpg", label: "Section plate", caption: "Collage for a file, not a portrait." },
  { src: "/the-week/cartoon-oct15.jpg", label: "Cartoon", caption: "Held on cream, not cropped away." },
];

const DIRECTION_REASONS: {
  n: string;
  title: string;
  text: string;
  example: string;
  source: string;
  shot?: string;
}[] = [
  {
    n: "01",
    title: "Two faces, two jobs",
    text: "A briefing is still a magazine. Palatino carries the sentence a reader stops for. Arial is only the furniture: kickers, buttons, numbers. People scan the labels, then settle into the serif.",
    example: "The Economist set its journalism in Economist Serif and its navigation, captions and subscribe lines in Economist Sans. Serif, they wrote, reads as trustworthy. Sans reads as the wayfinding.",
    source: "The Economist, 7 Feb 2024",
    shot: "/the-week/sources/economist-cover.jpg",
  },
  {
    n: "02",
    title: "Cream paper, one red",
    text: "The magazine is warm stock, not a white screen. Cream is the page. Red is the only colour that asks for a decision: a rule, a number, subscribe. Teal, blue and slate only name the kind of item.",
    example: "The Financial Times kept its salmon paper and set the news in Financier, a serif drawn for that redesign. Graphics use a sans. The Economist tells its own designers to use the red sparingly, so it still has impact.",
    source: "FT redesign, 2014 · Economist style guide",
    shot: "/the-week/sources/ft-2021.jpg",
  },
  {
    n: "03",
    title: "A colour for the time of day",
    text: "Morning, evening, Saturday and Sunday each have a ground, the way a cover has a colour. You know which briefing you are in before the headline. Under that, the article returns to cream.",
    example: "The Week prints the same departments in the same place every issue: the main stories, It wasn’t all bad, Only in America, Good week / Bad week. The reader knows where they are before they read. The edition grounds do that job for the time of day.",
    source: "Poynter on The Week, 2006",
    shot: "/the-week/sources/week-2024.jpg",
  },
  {
    n: "04",
    title: "Pictures as evidence",
    text: "A news picture is full-bleed, and the caption is part of the report. A collage is a file, for a roundup. A cartoon stays whole on cream, because the drawing is the point.",
    example: "The Week’s own file is “the main stories, and how they were covered”: other papers’ pictures and lines, credited. Almost every item names the publication that reported it. The picture is evidence, not decoration.",
    source: "The Week contents · Poynter, 2006",
    shot: "/the-week/section-newspapers.jpg",
  },
  {
    n: "05",
    title: "The lock is the rest of the file",
    text: "The opening stays readable. That is the briefing’s promise. The rest stays in the same column, locked or barred, so the paywall is the story continuing, not a modal in the way.",
    example: "The Economist’s wall sits in the column after the opening paragraph. You have the point. The rest of the piece is what you subscribe for. The Washington Post says it in the line itself: subscribe to continue reading.",
    source: "The Economist · The Washington Post",
  },
  {
    n: "06",
    title: "The name stays, the picture changes",
    text: "A current cover can be an illustration and still read as the same paper. The mark in the corner does the recognising. The drawing is the issue.",
    example: "The Atlantic, November 2026, “Battle of the Galactic Overlords.” The big A sits in the corner, the way it has for years. The illustration is what this issue is about.",
    source: "The Atlantic, November 2026",
    shot: "/the-week/sources/atlantic-2026.jpg",
  },
  {
    n: "07",
    title: "The drawing stays whole",
    text: "When the picture is the point, it is held complete. A cartoon and a cover illustration stay edge to edge, so the reader sees the thing that was drawn.",
    example: "The New Yorker, 26 October 2026, Mark Ulriksen’s “Make It Two.” One painting of the Knicks, edge to edge. The drawing is the page.",
    source: "The New Yorker, 26 Oct 2026",
    shot: "/the-week/sources/new-yorker-2026.jpg",
  },
  {
    n: "08",
    title: "A frame you already know",
    text: "A repeated mark does the recognising, so the picture inside can change every edition. Red is that mark here: a rule, a number, subscribe.",
    example: "Time, 26 October 2026, Shai Gilgeous-Alexander. The red border is the same as last week. The face is this week’s.",
    source: "Time, 26 Oct 2026",
    shot: "/the-week/sources/time-2026.jpg",
  },
  {
    n: "09",
    title: "The point, then why it matters",
    text: "A morning briefing can be shorter than a magazine and still be a paper. One sentence does the stopping. The next line says why it is worth the rest of the minute.",
    example: "Axios AM is a morning file in Smart Brevity: one sentence, then “Why it matters,” then the rest. The point is given away. What you stay for is the line that tells you what to do with it.",
    source: "Axios AM",
    shot: "/the-week/sources/axios-am.jpg",
  },
  {
    n: "10",
    title: "A map, then the lines",
    text: "A briefing can open as a file of the world: a picture that locates the stories, then a numbered list you can scan.",
    example: "Semafor Flagship, 14 January 2026. “The World Today” is a numbered map. Under it, the lines: Greenland, the Fed, China, Brazil. The map is the index.",
    source: "Semafor Flagship, 14 Jan 2026",
    shot: "/the-week/sources/semafor.jpg",
  },
  {
    n: "11",
    title: "A person, then the markets",
    text: "A daily can sound like a note from someone who read the news, and still carry the numbers. The voice comes first. The strip of markets comes after.",
    example: "Morning Brew opens with a note to readers, signed, then a markets table. You know who is talking before you know where the Nasdaq closed.",
    source: "Morning Brew",
    shot: "/the-week/sources/morning-brew.jpg",
  },
  {
    n: "12",
    title: "The name, a red rule, the note",
    text: "A political briefing can look like a letter. The wordmark and one red rule do the recognising. The morning is written underneath, in sentences.",
    example: "Politico Playbook puts the name and a red rule at the top, then the morning as a note: who wrote it, who helped, and the first paragraph you can read in a minute.",
    source: "Politico Playbook",
    shot: "/the-week/sources/playbook-2025.jpg",
  },
  {
    n: "13",
    title: "The sentence, then the picture",
    text: "A morning from a newspaper can keep the paper’s type and still be a briefing. One sentence stops you. The photograph is the evidence under it.",
    example: "The New York Times, The Morning. The name in the paper’s blackletter and a heavy serif, one sentence of the day, then the picture that carries it.",
    source: "The New York Times, The Morning",
    shot: "/the-week/sources/nyt-morning.jpg",
  },
  {
    n: "14",
    title: "One line you can say back",
    text: "A short briefing can put the whole point in a box. If the reader can repeat that line, the rest of the file has done its job.",
    example: "theSkimm’s Daily Skimm calls it “The Line”: one sentence in a coloured box, then the top story underneath. The line is what you remember.",
    source: "theSkimm, Daily Skimm",
    shot: "/the-week/sources/skimm.png",
  },
  {
    n: "15",
    title: "The front page is the file",
    text: "A newspaper still does the briefing’s job on one sheet: the masthead, the lead picture, and the other stories of the morning, in a fixed order.",
    example: "The Guardian, 19 November 2025. The blue masthead, the lead photograph, and the other stories of the day set in the same places as yesterday.",
    source: "The Guardian, 19 Nov 2025",
    shot: "/the-week/sources/guardian-front.jpg",
  },
  {
    n: "16",
    title: "An illustration can be the cover line",
    text: "A business weekly can lead with a drawing and a headline together. The picture explains the week. The type under it names the stories inside.",
    example: "Bloomberg Businessweek Indonesia, July 2026. One illustration fills the cover. The headline and three story lines sit along the bottom, like a contents strip.",
    source: "Bloomberg Businessweek, July 2026",
    shot: "/the-week/sources/bloomberg-2026.jpg",
  },
];

function DirectionBoard() {
  return (
    <div className="bg-[#C8C2B8] px-6 py-10">
      <div className="mx-auto w-[1440px] overflow-hidden bg-[#F4F0EA] px-12 py-12 text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-end justify-between gap-8 border-b-[3px] border-[#DF0A14] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-[#DF0A14] text-[12px] font-bold text-white">W</span>
              <span className="text-[12px] font-bold tracking-[0.28em]" style={romanBold}>
                THE WEEK
              </span>
            </div>
            <h1 className="mt-4 text-[64px] leading-[0.95]" style={roman}>
              Art direction
            </h1>
          </div>
          <p className="max-w-[36ch] pb-1 text-[18px] leading-7 text-[#374151]" style={roman}>
            Cream paper, Palatino for the story, Arial for the labels. Red is the only shout.
          </p>
        </div>

        <section className="mt-10" aria-label="Colour">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
            Colour
          </p>
          <div className="mt-4 grid grid-cols-8 gap-3">
            {DIRECTION_COLOURS.map((swatch) => (
              <div key={swatch.hex}>
                <div className="h-24 border border-black/10" style={{ background: swatch.hex }} />
                <p className="mt-2 text-[16px] leading-5" style={roman}>
                  {swatch.name}
                </p>
                <p className="text-[12px] leading-4 text-[#374151]" style={ui}>
                  {swatch.hex}
                </p>
                <p className="text-[12px] leading-4 text-[#374151]" style={roman}>
                  {swatch.note}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {DIRECTION_EDITIONS.map((edition) => (
              <div key={edition.name} className="relative h-36 overflow-hidden">
                <Image src={edition.image} alt="" fill sizes="320px" className="object-cover" />
                <div className="absolute inset-y-0 left-0 w-2/5" style={{ background: edition.hex }} />
                <div className="absolute bottom-3 left-4" style={{ color: edition.ink }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={uiBold}>
                    {edition.hex}
                  </p>
                  <p className="text-[28px] leading-8" style={roman}>
                    {edition.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-10" aria-label="Type">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
              Palatino · the story
            </p>
            <p className="mt-3 text-[48px] leading-[52px]" style={roman}>
              The rest of this article is locked
            </p>
            <p className="mt-4 max-w-[42ch] text-[18px] leading-7 text-[#374151]" style={roman}>
              Sign up to get access to news and opinion from over 200 global sources, brought together to help you see the bigger picture.
            </p>
            <p className="mt-4 text-[22px] leading-7" style={romanBold}>
              Daily Editions
            </p>
          </div>
          <div className="bg-white px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
              Arial · the labels
            </p>
            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em]" style={uiBold}>
              The Week subscriptions
            </p>
            <p className="mt-4 flex items-baseline gap-3 text-[15px] leading-6">
              <span className="text-[#DF0A14]" style={roman}>
                01
              </span>
              <span style={ui}>Morning, evening and weekend reports that matter.</span>
            </p>
            <p className="mt-5 inline-flex h-11 items-center bg-[#DF0A14] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white" style={uiBold}>
              Explore subscriptions
            </p>
          </div>
        </section>

        <section className="mt-12" aria-label="Pictures">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
            Pictures
          </p>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {DIRECTION_PICTURES.map((picture) => (
              <figure key={picture.src}>
                <div className="relative h-52 bg-white">
                  <Image src={picture.src} alt="" fill sizes="320px" className="object-cover" />
                </div>
                <figcaption className="mt-2">
                  <p className="text-[16px] leading-5" style={roman}>
                    {picture.label}
                  </p>
                  <p className="text-[13px] leading-4 text-[#374151]" style={roman}>
                    {picture.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto mt-8 w-[1440px] overflow-hidden bg-[#F4F0EA] px-12 py-12 text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-end justify-between gap-8 border-b border-black/15 pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
              Research and style
            </p>
            <h2 className="mt-3 text-[48px] leading-[52px]" style={roman}>
              Why this works for a briefing
            </h2>
          </div>
          <p className="max-w-[34ch] pb-1 text-[18px] leading-7 text-[#374151]" style={roman}>
            A feed shouts in every tile. A briefing keeps its voice in the type, and spends colour only when the reader needs to know where they are, or what to do.
          </p>
        </div>
        <ol className="mt-8 grid grid-cols-3 gap-8">
          {DIRECTION_REASONS.map((reason) => (
            <li key={reason.n} className="border-t border-black/15 pt-4">
              {reason.shot ? (
                <div className="relative mb-4 h-56 bg-white">
                  <Image src={reason.shot} alt="" fill sizes="440px" className="object-contain" />
                </div>
              ) : null}
              <p className="text-[15px] leading-5 text-[#DF0A14]" style={roman}>
                {reason.n}
              </p>
              <p className="mt-2 text-[26px] leading-8" style={roman}>
                {reason.title}
              </p>
              <p className="mt-3 text-[16px] leading-6 text-[#374151]" style={roman}>
                {reason.text}
              </p>
              <p className="mt-3 border-t border-black/10 pt-3 text-[14px] leading-5 text-[#1B1B1B]" style={roman}>
                {reason.example}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#DF0A14]" style={uiBold}>
                {reason.source}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 border-t-[3px] border-[#0A0A0A] pt-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={uiBold}>
              What the reader does
            </p>
            <p className="mt-3 text-[28px] leading-8" style={roman}>
              Scan the kicker. Read the sentence. Decide.
            </p>
            <p className="mt-3 max-w-[46ch] text-[16px] leading-6 text-[#374151]" style={roman}>
              The Week is a digest: Talking points, a statistic, a quote, a picture. Kickers in Arial are the scan. Palatino is the stop. Red marks the next action, and only that.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#83C8C5] px-3 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={uiBold}>
                Where
              </p>
              <p className="mt-2 text-[22px] leading-6" style={roman}>
                Morning
              </p>
            </div>
            <div className="bg-white px-3 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#DF0A14]" style={uiBold}>
                What
              </p>
              <p className="mt-2 text-[22px] leading-6" style={roman}>
                The point
              </p>
            </div>
            <div className="bg-[#DF0A14] px-3 py-4 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={uiBold}>
                Do
              </p>
              <p className="mt-2 text-[22px] leading-6" style={roman}>
                Sign up
              </p>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-black/15 pt-4 text-[13px] leading-5 text-[#374151]" style={roman}>
          Sources. The Economist, “Why has The Economist changed its typeface?”, 7 February 2024. The Economist brand guide, on using red sparingly. Financial Times redesign, Kevin Wilson in Design Week, September 2014. Poynter, “The little newsweekly that could,” 2006. The Atlantic, November 2026 cover. The New Yorker, 26 October 2026, cover by Mark Ulriksen. Time, 26 October 2026. Axios AM. Semafor Flagship, 14 January 2026. Morning Brew. Politico Playbook. The New York Times, The Morning. theSkimm, Daily Skimm. The Guardian, 19 November 2025. Bloomberg Businessweek Indonesia, July 2026. The Washington Post, subscribe to continue reading.
        </p>
      </div>
    </div>
  );
}

const COMPETITORS = [
  {
    name: "This briefing",
    hook: "Morning Premium, the picture, one subheading.",
    interest: "The opening stays readable.",
    capture: "A lock on the blur, in the column.",
    convert: "One button, about this article.",
  },
  {
    name: "The Economist",
    hook: "Red masthead and a serif that reads as authority.",
    interest: "The first paragraph is yours.",
    capture: "The wall continues in the column.",
    convert: "Subscribe to read on.",
  },
  {
    name: "Financial Times",
    hook: "Salmon paper. You know the paper before the story.",
    interest: "A finite read: what you need to know today.",
    capture: "The briefing is short takes, not the whole site.",
    convert: "The edition, not another copy of the homepage.",
  },
  {
    name: "New York Times",
    hook: "The story on the homepage.",
    interest: "A meter of free articles, then it stops.",
    capture: "Register first, so the next visit is known.",
    convert: "A paywall once the free reads run out.",
  },
  {
    name: "Washington Post",
    hook: "The article you came to read.",
    interest: "Some of the piece, then it is covered.",
    capture: "A box over the story you cannot close.",
    convert: "Subscribe to continue reading.",
  },
];

const READER_ART = {
  "catch-up": "/the-week/readers/reader-catch-up.jpg",
  completist: "/the-week/readers/reader-completist.jpg",
  habit: "/the-week/readers/reader-habit.jpg",
  pays: "/the-week/readers/reader-pays.jpg",
} as const;

function ReaderSketch({ kind }: { kind: keyof typeof READER_ART }) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-[#F0EAE1]">
      <Image src={READER_ART[kind]} alt="" fill sizes="320px" className="object-cover object-center" />
    </div>
  );
}

const READERS = [
  {
    n: "01",
    kind: "catch-up" as const,
    name: "The catch-up",
    who: "Ten minutes, on the way somewhere. They want the point, not the file.",
    needs: "A subheading that is the story, and an opening that delivers it.",
    here: "The hero and the readable opening do this. The lock only works if that sample was enough.",
  },
  {
    n: "02",
    kind: "completist" as const,
    name: "The completist",
    who: "They have the point and want the names, the figures, and what happens next.",
    needs: "The rest, in the same place, without starting again.",
    here: "The blur is their reason to pay. The card should stay about this article first.",
  },
  {
    n: "03",
    kind: "habit" as const,
    name: "The habit",
    who: "They already know morning from evening. They come for the edition, not one piece.",
    needs: "Every edition, and the inbox, said plainly.",
    here: "Daily editions and “wherever you read” are for them. The single-article headline is not.",
  },
  {
    n: "04",
    kind: "pays" as const,
    name: "Already pays",
    who: "They already subscribe. On this visit they are signed out. They are not a sale.",
    needs: "Sign in, in the same place as the lock. The wrong email is the rare case.",
    here: "Sign in sits under the two sale buttons, so the page still pitches someone who already pays.",
  },
];

function ConversionBoard() {
  return (
    <div className="bg-[#C8C2B8] px-6 py-10">
      <div className="mx-auto w-[1440px] overflow-hidden bg-[#F4F0EA] px-12 py-12 text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-end justify-between gap-8 border-b-[3px] border-[#DF0A14] pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
              Premium briefing
            </p>
            <h1 className="mt-3 text-[56px] leading-[0.95]" style={roman}>
              Hook. Interest. Capture. Convert.
            </h1>
          </div>
          <p className="max-w-[36ch] pb-1 text-[18px] leading-7 text-[#374151]" style={roman}>
            The sale is the rest of the story. Each step has one job, and the ask comes last.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-2 gap-8">
          <li className="border-t border-black/15 pt-4">
            <p className="text-[15px] leading-5 text-[#DF0A14]" style={roman}>01 · Hook</p>
            <p className="mt-2 text-[32px] leading-9" style={roman}>Stop them on a story, not an offer.</p>
            <div className="relative mt-4 h-40 overflow-hidden">
              <Image src="/the-week/pike.jpg" alt="" fill sizes="640px" className="object-cover object-[center_20%]" />
              <div className="absolute inset-y-0 left-0 flex w-[46%] flex-col justify-end bg-[#83C8C5] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={uiBold}>Morning Premium</p>
                <p className="mt-1 text-[22px] leading-6" style={roman}>Pike, after the execution failed</p>
              </div>
            </div>
            <p className="mt-4 text-[16px] leading-6 text-[#374151]" style={roman}>
              Attention is the scarce thing. The hero, the picture and a specific subheading do the stopping. The price does not. A named story beats “subscribe to our brand”, because the reader arrived for the news.
            </p>
          </li>

          <li className="border-t border-black/15 pt-4">
            <p className="text-[15px] leading-5 text-[#DF0A14]" style={roman}>02 · Interest</p>
            <p className="mt-2 text-[32px] leading-9" style={roman}>Give the point. Withhold the file.</p>
            <div className="mt-4 bg-white px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#DF0A14]" style={uiBold}>What happened</p>
              <p className="mt-2 text-[18px] leading-7" style={roman}>
                The opening is readable. The reader gets the point of the briefing before anyone asks for money.
              </p>
              <p className="mt-2 select-none text-[18px] leading-7 text-black/80 blur-[3px]" aria-hidden>
                The names, the figures and the sentence that comes next stay with subscribers.
              </p>
            </div>
            <p className="mt-4 text-[16px] leading-6 text-[#374151]" style={roman}>
              Value first, then the gap. If the sample is dull, the lock is a dead end. The interesting bit has to be good enough that the rest feels worth paying for. That is the sample, not a teaser with nothing in it.
            </p>
          </li>

          <li className="border-t border-black/15 pt-4">
            <p className="text-[15px] leading-5 text-[#DF0A14]" style={roman}>03 · Capture</p>
            <p className="mt-2 text-[32px] leading-9" style={roman}>Hold them in the column.</p>
            <div className="relative mt-4 bg-white px-4 py-8">
              <p className="select-none text-[18px] leading-7 blur-[5px]" aria-hidden>
                The rest of the report stays in the same place the reader was already reading. Leaving means dropping a sentence.
              </p>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <SignUpToUnlock />
              </div>
            </div>
            <p className="mt-4 text-[16px] leading-6 text-[#374151]" style={roman}>
              Capture is not the email yet. Capture is the unfinished story. An unfinished task stays in mind, so the lock sits on the blur, in the reading line. A modal would break the read. The button is the next line.
            </p>
          </li>

          <li className="border-t border-black/15 pt-4">
            <p className="text-[15px] leading-5 text-[#DF0A14]" style={roman}>04 · Convert</p>
            <p className="mt-2 text-[32px] leading-9" style={roman}>One decision, about this article.</p>
            <div className="mt-4 border border-[#0A0A0A] bg-white">
              <div className="bg-[#83C8C5] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={uiBold}>The Week subscriptions</p>
                <p className="mt-1 text-[22px] leading-6" style={roman}>The rest of this article is locked</p>
              </div>
              <div className="h-[3px] bg-[#DF0A14]" />
              <div className="px-4 py-3">
                <p className="text-[14px] leading-5" style={roman}>Daily editions. The whole site. Puzzles. Wherever you read.</p>
                <p className="mt-3 inline-flex h-11 items-center bg-[#DF0A14] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white" style={uiBold}>
                  Explore subscriptions
                </p>
              </div>
            </div>
            <p className="mt-4 text-[16px] leading-6 text-[#374151]" style={roman}>
              One red action. The headline is the article they already started, then the benefits widen it to the subscription. Two equal buttons split the decision. Red is the only shout on the page, so this is the shout.
            </p>
          </li>
        </ol>

        <div className="mt-10 grid grid-cols-4 border-t-[3px] border-[#0A0A0A]">
          {[
            ["Hook", "Where am I, and why should I stop?"],
            ["Interest", "Is the point good enough to want the rest?"],
            ["Capture", "Am I already in the middle of it?"],
            ["Convert", "What do I do, and only that?"],
          ].map(([name, question]) => (
            <div key={name} className="border-r border-black/15 px-4 py-4 last:border-r-0">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#DF0A14]" style={uiBold}>{name}</p>
              <p className="mt-2 text-[18px] leading-6" style={roman}>{question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 w-[1440px] overflow-hidden bg-[#F4F0EA] px-12 py-12 text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
          Competitors
        </p>
        <h2 className="mt-3 max-w-[18ch] text-[48px] leading-[52px]" style={roman}>
          How other papers sell the rest of the story
        </h2>
        <p className="mt-4 max-w-[54ch] text-[18px] leading-7 text-[#374151]" style={roman}>
          Same four jobs. The difference is where they put the wall, and whether the reader already has the point.
        </p>
        <div className="mt-8 overflow-hidden border border-black/15 bg-white">
          <div className="grid grid-cols-[160px_repeat(4,minmax(0,1fr))] border-b border-black/15 bg-[#F4F0EA]">
            {["", "Hook", "Interest", "Capture", "Convert"].map((label) => (
              <p key={label || "who"} className="px-3 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#DF0A14]" style={uiBold}>
                {label}
              </p>
            ))}
          </div>
          {COMPETITORS.map((row) => (
            <div key={row.name} className="grid grid-cols-[160px_repeat(4,minmax(0,1fr))] border-b border-black/10 last:border-b-0">
              <p className="px-3 py-4 text-[16px] leading-5" style={romanBold}>{row.name}</p>
              {[row.hook, row.interest, row.capture, row.convert].map((cell) => (
                <p key={cell} className="px-3 py-4 text-[14px] leading-5 text-[#374151]" style={roman}>{cell}</p>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-5 text-[#374151]" style={roman}>
          The Economist puts the wall in the column after the opening. The Washington Post covers the piece with a box you cannot close. The New York Times counts free articles, then asks you to register, then to subscribe. The Financial Times sells a finite daily read, not another copy of the site.
        </p>
      </div>

      <div className="mx-auto mt-8 w-[1440px] overflow-hidden bg-[#F4F0EA] px-12 py-12 text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DF0A14]" style={uiBold}>
          Readers
        </p>
        <h2 className="mt-3 text-[48px] leading-[52px]" style={roman}>
          Four people, four asks
        </h2>
        <p className="mt-4 max-w-[52ch] text-[18px] leading-7 text-[#374151]" style={roman}>
          The Week’s reader is busy and wants the point. They are not all the same person once the story locks.
        </p>
        <ol className="mt-8 grid grid-cols-4 gap-6">
          {READERS.map((reader) => (
            <li key={reader.name} className="border-t border-black/15 pt-4">
              <ReaderSketch kind={reader.kind} />
              <p className="mt-3 text-[15px] leading-5 text-[#DF0A14]" style={roman}>{reader.n}</p>
              <p className="mt-2 text-[26px] leading-7" style={roman}>{reader.name}</p>
              <p className="mt-3 text-[15px] leading-5 text-[#374151]" style={roman}>{reader.who}</p>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.12em]" style={uiBold}>Needs</p>
              <p className="mt-1 text-[15px] leading-5" style={roman}>{reader.needs}</p>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.12em]" style={uiBold}>On this page</p>
              <p className="mt-1 text-[15px] leading-5 text-[#374151]" style={roman}>{reader.here}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SubscribeBoard() {
  const edition = EDITIONS.find((item) => item.id === "morning") ?? EDITIONS[0];
  const stories = edition.stories.slice(0, 2);
  const noop = () => {};

  return (
    <div className="bg-[#C8C2B8] px-6 py-10">
      <div className="mx-auto w-[1440px] overflow-hidden bg-[#F4F0EA] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <EditionHero edition={edition} stories={edition.stories} access="blur" />
        <div className="grid grid-cols-2 gap-6 px-12 py-10">
          <div className="min-w-0">
            {stories.map((story, index) => (
              <StoryColumn
                key={story.id}
                story={story}
                index={index}
                next={stories[index + 1]}
                onSelect={noop}
                onExpand={noop}
                access="blur"
              />
            ))}
          </div>
          <div className="min-w-0 bg-[#F4F0EA]">
            <StickyMedia
              stories={stories}
              activeId={stories[0].id}
              onSelect={noop}
              onExpand={noop}
              gate="blur"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopBoard() {
  const edition = EDITIONS.find((item) => item.id === "morning") ?? EDITIONS[0];
  const story = edition.stories[0];

  return (
    <div className="bg-[#C8C2B8] px-6 py-10">
      <div className="mx-auto w-[1440px] overflow-hidden bg-[#F4F0EA] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <EditionHero edition={edition} stories={edition.stories} access="redacted" />
        <div className="grid grid-cols-2 gap-10 px-12 py-12 xl:px-16">
          <div>
            <p
              className="inline-flex h-7 w-fit items-center gap-2 px-1.5 py-1 text-[14px] font-bold uppercase leading-5 text-white"
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 700,
                background: typeInk(story.chip),
              }}
            >
              <span>01</span>
              <span>{story.kicker}</span>
            </p>
            <h2 className="mt-5 text-[48px] leading-[56px] text-black" style={roman}>
              {story.dek}
            </h2>
            <p className="mt-4 max-w-[65ch] text-[18px] leading-7 text-[#374151]" style={roman}>
              {story.displayTitle}
            </p>
            <div className="mt-16">
              <GatedStoryBody story={story} access="redacted" lead />
            </div>
          </div>
          <div className={`relative h-[460px] overflow-hidden ${story.imageFit === "contain" ? "bg-white" : ""}`}>
            {story.imageSrc ? (
              <Image src={story.imageSrc} alt="" fill sizes="720px" className={story.imageFit === "contain" ? "object-contain" : "object-cover"} />
            ) : (
              <div className="absolute inset-0" style={{ background: story.imageGradient }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center bg-[#DF0A14] text-[12px] font-bold text-white">W</span>
      <span className="text-[12px] font-bold tracking-[0.28em]" style={romanBold}>
        THE WEEK
      </span>
    </div>
  );
}

function AdPicture({
  sources,
  caption,
  focus = "center",
}: {
  sources: readonly string[];
  caption?: string;
  focus?: string;
}) {
  return (
    <div className="relative h-[292px] shrink-0 bg-[#0A0A0A]">
      {sources.length > 1 ? (
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-px bg-[#0A0A0A]">
          {sources.map((src) => (
            <div key={src} className="relative">
              <Image src={src} alt="" fill sizes="195px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <Image src={sources[0]} alt="" fill sizes="390px" className="object-cover" style={{ objectPosition: focus }} />
      )}
      {caption ? (
        <p
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2.5 pt-10 text-[11px] leading-4 text-white"
          style={ui}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function AdPortrait({
  ground = "#F4F0EA",
  sources,
  caption,
  focus,
  children,
}: {
  ground?: string;
  sources: readonly string[];
  caption?: string;
  focus?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-[#C8C2B8] px-6 py-10">
      <article className="flex h-[844px] w-[390px] flex-col overflow-hidden text-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,0.2)]" style={{ background: ground }}>
        <AdPicture sources={sources} caption={caption} focus={focus} />
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-5">{children}</div>
      </article>
    </div>
  );
}

const AD_BENEFITS = [
  { mark: "🔓", title: "Full context", text: "Complete names, data, and deep-dive analysis." },
  { mark: "📰", title: "Complete briefings", text: "Morning, evening, and weekend editions." },
  { mark: "📬", title: "Straight to your inbox", text: "Top stories delivered daily, uninterrupted." },
];

function AdCopy({ title, sub, children }: { title: string; sub: string; children?: ReactNode }) {
  return (
    <>
      <AdMark />
      <h1 className="mt-4 min-h-[98px] text-[34px] uppercase leading-[0.95] tracking-[0.01em]" style={roman}>
        {title}
      </h1>
      <p className="mt-3 min-h-[48px] text-[16px] leading-6" style={roman}>
        {sub}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </>
  );
}

function AdFrame({ frame }: { frame: 1 | 2 | 3 }) {
  if (frame === 1) {
    return (
      <AdPortrait
        sources={["/the-week/pike.jpg"]}
        focus="center 32%"
        caption="Randy Spivey, Pike’s lawyer. George Walker IV / AP"
      >
        <AdCopy title="You don’t have access yet" sub="To get the full story, sign up.">
          <p className="text-[16px] leading-6" style={roman}>
            Unlock the complete analysis and exclusive reporting hidden inside.
          </p>
        </AdCopy>
      </AdPortrait>
    );
  }

  if (frame === 2) {
    return (
      <AdPortrait
        sources={[
          "/the-week/hero-morning-field.jpg",
          "/the-week/hero-evening-field.jpg",
          "/the-week/hero-saturday-field.jpg",
          "/the-week/hero-sunday-field.jpg",
        ]}
      >
        <AdCopy title="Unlock premium articles" sub="Sign up to get the full story.">
          <ol>
            {AD_BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-3 border-t border-black/15 py-2.5 first:border-t-0 first:pt-0">
                <span className="w-6 shrink-0 text-[18px] leading-5" aria-hidden>
                  {benefit.mark}
                </span>
                <span>
                  <p className="text-[16px] leading-5" style={romanBold}>
                    {benefit.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-4 text-[#374151]" style={roman}>
                    {benefit.text}
                  </p>
                </span>
              </li>
            ))}
          </ol>
        </AdCopy>
      </AdPortrait>
    );
  }

  return (
    <AdPortrait ground="#83C8C5" sources={["/the-week/hero-morning-field.jpg"]} focus="center">
      <AdCopy title="Start reading today" sub="6 weeks for $1, then $89 a year. Cancel anytime.">
        <a
          href={DIGITAL_SUBSCRIBE}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center bg-[#DF0A14] px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-white"
          style={uiBold}
        >
          Subscribe &amp; save
        </a>
      </AdCopy>
    </AdPortrait>
  );
}

function MobileFeed({
  edition,
  stories,
  onEdition,
  registerFeed,
  axisLock,
  onCoverChange,
  reportReading,
  onReading,
  access,
  onHub,
}: {
  edition: WeekEdition;
  stories: WeekStory[];
  onEdition: (id: EditionId) => void;
  registerFeed: (id: EditionId, node: HTMLDivElement | null) => void;
  axisLock: boolean;
  onCoverChange: (onCover: boolean) => void;
  reportReading: boolean;
  onReading: (reading: MobileReading) => void;
  access: MorningAccess;
  onHub: () => void;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const nudgeLock = useRef(false);

  useEffect(() => {
    registerFeed(edition.id, localRef.current);
    return () => registerFeed(edition.id, null);
  }, [edition.id, registerFeed]);

  const paint = useCallback(() => {
    const feed = localRef.current;
    if (!feed) return;
    updateReelMotion(feed);
    onCoverChange(feedAllowsSideSwipe(feed));
    if (reportReading) onReading(readMobileFeed(feed, stories.length));
  }, [onCoverChange, onReading, reportReading, stories.length]);

  useLayoutEffect(() => {
    const feed = localRef.current;
    if (feed) updateReelMotion(feed);
  });

  const nudge = useCallback((direction: 1 | -1) => {
    const feed = localRef.current;
    if (!feed || nudgeLock.current) return;
    nudgeLock.current = true;
    const reduce = reduceMotion();
    feed.scrollBy({ top: direction * feed.clientHeight, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      nudgeLock.current = false;
    }, 460);
  }, []);

  return (
    <div
      ref={localRef}
      data-feed={edition.id}
      onScroll={paint}
      className={`relative h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        axisLock ? "[touch-action:pan-y]" : ""
      }`}
    >
      <div data-card className="relative h-full shrink-0 snap-start snap-always overflow-hidden">
        <EditionHero edition={edition} stories={stories} fill access={access} />
        <div
          data-rise="1.2"
          className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 flex flex-col items-center gap-2"
        >
          <p
            className="text-center text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ ...uiBold, color: "#FFFFFF" }}
          >
            Scroll down for next story
          </p>
          <ChevronDown size={16} aria-hidden className="text-white" />
          <div className="flex items-center gap-1.5" aria-hidden>
            {BRIEFING_EDITIONS.map((item) => (
              <span
                key={item.id}
                className={`h-1 rounded-full bg-white ${item.id === edition.id ? "w-5" : "w-1.5 opacity-45"}`}
              />
            ))}
          </div>
        </div>
      </div>
      {stories.map((story, index) => (
        <MobileStory
          key={story.id}
          story={story}
          stories={stories}
          index={index}
          total={stories.length}
          onEdge={nudge}
          onFrame={paint}
          access={edition.id === "morning" ? access : "open"}
        />
      ))}
      {edition.id === "morning" && access !== "open" ? null : (
      <div data-card className="h-full shrink-0 snap-start snap-always">
        <CaughtUp
          edition={edition}
          onEdition={onEdition}
          className="flex h-full flex-col justify-center bg-[#F4F0EA] px-6"
        />
      </div>
      )}
      <div data-card data-archive className="h-full shrink-0 snap-start snap-always overflow-hidden bg-[#F4F0EA]">
        <div className="h-full overflow-y-auto overscroll-y-contain px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PreviousEditions onEdition={onEdition} onHub={onHub} compact />
        </div>
      </div>
    </div>
  );
}

function MobileReadingBar({
  edition,
  stories,
  reading,
  onTop,
  onSelect,
  onEdition,
  access,
}: {
  edition: WeekEdition;
  stories: WeekStory[];
  reading: MobileReading;
  onTop: () => void;
  onSelect: (id: string) => void;
  onEdition: (id: EditionId) => void;
  access: MorningAccess;
}) {
  const [open, setOpen] = useState(false);
  const [seenEdition, setSeenEdition] = useState(edition.id);
  const [seenScrolled, setSeenScrolled] = useState(reading.scrolled);
  if (edition.id !== seenEdition) {
    setSeenEdition(edition.id);
    setOpen(false);
  }
  if (reading.scrolled !== seenScrolled) {
    setSeenScrolled(reading.scrolled);
    if (!reading.scrolled) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!reading.scrolled) return null;

  const total = String(stories.length).padStart(2, "0");
  const current = stories[reading.index];

  return (
    <div className="fixed inset-x-0 top-0 z-40 bg-white md:hidden">
      <div className="flex h-[72px] items-center gap-2 px-3">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">
            <li className="shrink-0">
              <button type="button" onClick={onTop} className="text-[#DF0A14]" style={romanBold}>
                The Week
              </button>
            </li>
            <li aria-hidden className="shrink-0 text-[#9CA3AF]">
              /
            </li>
            <li className="min-w-0">
              <button type="button" onClick={onTop} className="block max-w-full truncate text-[#374151]" style={uiBold}>
                {edition.id === "morning" && access !== "open" ? "Morning Premium" : edition.briefing}
              </button>
            </li>
            <li aria-hidden className="shrink-0 text-[#9CA3AF]">
              /
            </li>
            <li aria-current="page" className="shrink-0 text-black" style={uiBold}>
              {storyNumber(reading.index)}/{total}
            </li>
          </ol>
          {current ? (
            <p className="mt-0.5 truncate text-[13px] leading-4 text-black" style={roman}>
              {current.menuTitle}
            </p>
          ) : null}
        </nav>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-story-index"
          aria-label={open ? "Close stories" : "Open stories"}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[22px] leading-none text-black"
        >
          {open ? "×" : "☰"}
        </button>
      </div>
      <div className="h-[3px] bg-[#E5E7EB]" aria-hidden>
        <div
          className="h-full bg-[#DF0A14] motion-reduce:transition-none transition-[width] duration-200"
          style={{ width: `${Math.round(reading.progress * 100)}%` }}
        />
      </div>
      {open ? (
        <nav
          id="mobile-story-index"
          aria-label="Stories"
          className="max-h-[70vh] overflow-y-auto border-b border-[#E5E7EB] bg-white"
        >
          <div className="flex gap-1 overflow-x-auto px-3 py-2">
            {BRIEFING_EDITIONS.map((item) => {
              const active = item.id === edition.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onEdition(item.id)}
                  className={`inline-flex h-9 shrink-0 items-center px-2 text-[12px] font-bold uppercase tracking-[0.08em] ${
                    active ? "text-[#DF0A14]" : "text-[#6B7280]"
                  }`}
                  style={uiBold}
                >
                  {item.briefing}
                </button>
              );
            })}
          </div>
          <ol className="px-3 pb-3">
            {stories.map((story, index) => {
              const isActive = index === reading.index;
              return (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect(story.id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className="flex min-h-11 w-full items-start gap-3 py-2 text-left"
                  >
                    <span
                      className={`w-7 shrink-0 ${isActive ? "text-[#DF0A14]" : "text-[#9CA3AF]"}`}
                      style={roman}
                    >
                      {storyNumber(index)}
                    </span>
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="line-clamp-1 min-w-0 flex-1 text-[16px] leading-5 text-black" style={roman}>
                        {story.menuTitle}
                      </span>
                      {edition.id === "morning" && access !== "open" ? (
                        <Lock size={14} strokeWidth={2} aria-hidden className="shrink-0 text-[#6B7280]" />
                      ) : null}
                      <StoryChip chip={story.chip} label={story.kicker} beside />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}

function MobilePager({
  editionId,
  editions = BRIEFING_EDITIONS,
  menuTick,
  onSwipeEdition,
  onEdition,
  access,
  onHub,
}: {
  editionId: EditionId;
  editions?: WeekEdition[];
  menuTick: number;
  onSwipeEdition: (id: EditionId) => void;
  onEdition: (id: EditionId) => void;
  access: MorningAccess;
  onHub: () => void;
}) {
  const pagerRef = useRef<HTMLDivElement>(null);
  const feedRefs = useRef<Partial<Record<EditionId, HTMLDivElement | null>>>({});
  const registerFeed = useCallback((id: EditionId, node: HTMLDivElement | null) => {
    feedRefs.current[id] = node;
  }, []);
  const ignoreScroll = useRef(false);
  const editionRef = useRef(editionId);

  useEffect(() => {
    editionRef.current = editionId;
  }, [editionId]);
  const [axisLock, setAxisLock] = useState(false);
  const [reading, setReading] = useState<MobileReading>({ scrolled: false, index: 0, progress: 0, archive: false });
  const onReading = useCallback((next: MobileReading) => {
    setReading((prev) => {
      if (
        prev.scrolled === next.scrolled &&
        prev.index === next.index &&
        prev.archive === next.archive &&
        Math.abs(prev.progress - next.progress) < 0.008
      ) {
        return prev;
      }
      return next;
    });
  }, []);
  const [seenMenuTick, setSeenMenuTick] = useState(menuTick);
  if (menuTick !== seenMenuTick) {
    setSeenMenuTick(menuTick);
    setAxisLock(false);
  }

  useEffect(() => {
    if (!menuTick) return;
    const pager = pagerRef.current;
    if (!pager) return;
    const index = Math.max(
      editions.findIndex((item) => item.id === editionRef.current),
      0,
    );
    const left = index * pager.clientWidth;
    feedRefs.current[editionRef.current]?.scrollTo(0, 0);
    if (Math.abs(pager.scrollLeft - left) < 2) {
      ignoreScroll.current = false;
      return;
    }
    ignoreScroll.current = true;
    pager.scrollTo({ left, behavior: "smooth" });
  }, [menuTick, editions]);

  useEffect(() => {
    const pager = pagerRef.current;
    if (!pager || !axisLock) return;
    const index = Math.max(
      editions.findIndex((item) => item.id === editionRef.current),
      0,
    );
    pager.scrollLeft = index * pager.clientWidth;
  }, [axisLock, editions]);

  const handlePagerScroll = () => {
    const pager = pagerRef.current;
    if (!pager || pager.clientWidth === 0) return;
    const index = Math.round(pager.scrollLeft / pager.clientWidth);
    const next = editions[index];
    if (!next) return;
    const settled = Math.abs(pager.scrollLeft - index * pager.clientWidth) < 2;
    if (ignoreScroll.current) {
      if (settled) ignoreScroll.current = false;
      return;
    }
    if (settled && next.id !== editionRef.current) {
      onSwipeEdition(next.id);
      const feed = feedRefs.current[next.id];
      setAxisLock(feed ? !feedAllowsSideSwipe(feed) : false);
      if (feed) onReading(readMobileFeed(feed, next.stories.length));
    }
  };

  const jumpToStory = useCallback((id: string) => {
    const feed = feedRefs.current[editionRef.current];
    const storyEl = feed?.querySelector<HTMLElement>(`#m-${id}`);
    const sheet = storyEl?.querySelector<HTMLElement>("[data-sheet]");
    if (sheet) sheet.scrollTop = 0;
    if (!feed || !storyEl) return;
    feed.scrollTo({
      top: storyEl.offsetTop,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
  }, []);

  const jumpToTop = useCallback(() => {
    feedRefs.current[editionRef.current]?.scrollTo({
      top: 0,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
  }, []);

  const edition = editions.find((item) => item.id === editionId) ?? editions[0];

  return (
    <>
    <MobileReadingBar
      edition={edition}
      stories={edition.stories}
      reading={reading}
      onTop={jumpToTop}
      onSelect={jumpToStory}
      onEdition={onEdition}
      access={access}
    />
    <div
      ref={pagerRef}
      onScroll={handlePagerScroll}
      className={`flex h-[calc(100dvh-72px)] w-full snap-x snap-mandatory overflow-y-hidden overscroll-x-contain md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        axisLock ? "overflow-x-hidden" : "overflow-x-auto"
      }`}
    >
      {editions.map((item) => (
        <div key={item.id} className="h-full w-full min-w-0 max-w-full shrink-0 basis-full snap-start snap-always overflow-hidden">
          <MobileFeed
            edition={item}
            stories={item.stories}
            onEdition={onEdition}
            registerFeed={registerFeed}
            axisLock={axisLock && item.id === editionId}
            onCoverChange={(onCover) => {
              if (item.id !== editionRef.current) return;
              setAxisLock(!onCover);
            }}
            reportReading={item.id === editionId}
            onReading={onReading}
            access={access}
            onHub={onHub}
          />
        </div>
      ))}
    </div>
    </>
  );
}

export default function TheWeekArticle({ version = "prototype" }: { version?: "prototype" | "real" }) {
  const catalog = useMemo(
    () =>
      version === "real"
        ? EDITIONS.map((item) => (item.id === "morning" ? realMorningEdition() : item))
        : EDITIONS,
    [version],
  );
  const briefingEditions = catalog.filter((item) => item.id !== "all");
  const [editionId, setEditionId] = useState<EditionId>("morning");
  const edition = catalog.find((item) => item.id === editionId) ?? catalog[0];
  const stories = edition.stories;
  const storiesRef = useRef(stories);
  useEffect(() => {
    storiesRef.current = stories;
  }, [stories]);
  const [activeId, setActiveId] = useState(stories[0].id);
  const [expanded, setExpanded] = useState<WeekStory | null>(null);
  const [compact, setCompact] = useState(false);
  const [menuTick, setMenuTick] = useState(0);
  const [access, setAccess] = useState<MorningAccess>("open");
  const [board, setBoard] = useState<WeekBoard>("off");
  const [hub, setHub] = useState(false);
  const clickingRef = useRef<string | null>(null);
  const activeIndex = Math.max(
    stories.findIndex((story) => story.id === activeId),
    0,
  );

  const applyEdition = useCallback((id: EditionId) => {
    const next = catalog.find((item) => item.id === id) ?? catalog[0];
    storiesRef.current = next.stories;
    setEditionId(id);
    setActiveId(next.stories[0].id);
    setExpanded(null);
  }, [catalog]);

  const switchEdition = useCallback(
    (id: EditionId) => {
      setHub(false);
      applyEdition(id);
      setMenuTick((tick) => tick + 1);
      window.scrollTo(0, 0);
    },
    [applyEdition],
  );

  const openHub = useCallback(() => {
    setHub(true);
    setBoard("off");
    window.scrollTo(0, 0);
  }, []);

  const adoptSwipe = useCallback(
    (id: EditionId) => {
      applyEdition(id);
    },
    [applyEdition],
  );

  const closeImage = useCallback(() => setExpanded(null), []);

  const jumpToStory = useCallback((id: string) => {
    setActiveId(id);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (mobile) {
      clickingRef.current = null;
      const storyEl = document.getElementById(`m-${id}`);
      const feed = storyEl?.closest("[data-feed]");
      const sheet = storyEl?.querySelector("[data-sheet]");
      if (sheet instanceof HTMLElement) sheet.scrollTop = 0;
      if (storyEl && feed instanceof HTMLElement) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        feed.scrollTo({
          top: storyEl.offsetTop,
          behavior: reduce ? "auto" : "smooth",
        });
      }
      return;
    }
    clickingRef.current = id;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      setCompact(window.scrollY > 96);
      if (clickingRef.current) {
        const target = document.getElementById(clickingRef.current);
        const top = target?.getBoundingClientRect().top ?? 0;
        const reached = Math.abs(top - spyOffset()) < 72;
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 8;
        if (!reached && !atBottom) return;
        clickingRef.current = null;
      }
      const nextId = storyIdAtScroll(storiesRef.current);
      setActiveId((prev) => (prev === nextId ? prev : nextId));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div id="top" className={`min-h-screen overflow-x-clip bg-[#F4F0EA] ${board === "off" && !hub ? "max-md:h-dvh max-md:overflow-hidden" : ""}`}>
      <WeekHeader
        editionId={edition.id}
        onEdition={switchEdition}
        access={access}
        onAccess={setAccess}
        board={board}
        onBoard={setBoard}
        hub={hub}
        onHub={openHub}
        version={version}
      />
      {board === "mobile" ? (
        <MobileBoard edition={edition} stories={stories} access={access} onEdition={switchEdition} />
      ) : null}
      {board === "desktop" ? <DesktopBoard /> : null}
      {board === "subscribe" ? <SubscribeBoard /> : null}
      {board === "direction" ? <DirectionBoard /> : null}
      {board === "convert" ? <ConversionBoard /> : null}
      {board === "ad-1" ? <AdFrame frame={1} /> : null}
      {board === "ad-2" ? <AdFrame frame={2} /> : null}
      {board === "ad-3" ? <AdFrame frame={3} /> : null}
      {board === "off" && hub ? <DailyEditionsHub onEdition={switchEdition} /> : null}
      {board === "off" && !hub ? (
      <>
      <MobilePager
        editionId={edition.id}
        editions={briefingEditions}
        menuTick={menuTick}
        onSwipeEdition={adoptSwipe}
        onEdition={switchEdition}
        access={access}
        onHub={openHub}
      />
      <div className="hidden md:block">
      {compact ? (
        <ReadingBar
          stories={stories}
          briefing={edition.id === "morning" && access !== "open" ? "Morning Premium" : edition.briefing}
          activeIndex={activeIndex}
          onSelect={jumpToStory}
          access={edition.id === "morning" ? access : undefined}
        />
      ) : null}

      <EditionHero edition={edition} stories={stories} access={access} />

      <div className="mx-auto grid max-w-[1920px] grid-cols-1 px-4 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6 lg:pl-8 lg:pr-[50px] lg:pt-10 xl:pl-12 xl:pr-[50px] min-[1440px]:pl-20 min-[1440px]:pr-[50px] 2xl:pl-[177px] 2xl:pr-[50px]">
        <div className="min-w-0">
          {stories.map((story, index) => (
            <StoryColumn
              key={story.id}
              story={story}
              index={index}
              next={stories[index + 1]}
              onSelect={jumpToStory}
              onExpand={setExpanded}
              access={edition.id === "morning" ? access : "open"}
            />
          ))}
          <EditionSources stories={stories} />
        </div>

        <div className="relative z-10 hidden min-w-0 self-stretch bg-[#F4F0EA] shadow-[-24px_0_0_#F4F0EA,100vw_0_0_#F4F0EA] lg:block">
          <div className="sticky top-[calc(52px+2.5rem)] z-10 bg-[#F4F0EA]">
            <StickyMedia
              stories={stories}
              activeId={activeId}
              onSelect={jumpToStory}
              onExpand={setExpanded}
              gate={edition.id === "morning" ? access : "open"}
            />
          </div>
        </div>
      </div>

      {edition.id === "morning" && access !== "open" ? null : (
      <CaughtUp
        edition={edition}
        onEdition={switchEdition}
        className="mx-auto max-w-[1920px] px-4 py-20 sm:px-8 md:px-10 lg:px-8 xl:px-12 min-[1440px]:px-20 2xl:px-[177px]"
      />
      )}
      <div className="mx-auto max-w-[1920px] px-4 pb-20 sm:px-8 md:px-10 lg:px-8 xl:px-12 min-[1440px]:px-20 2xl:px-[177px]">
        <PreviousEditions onEdition={switchEdition} onHub={openHub} />
      </div>
      </div>
      </>
      ) : null}
      <ImageLightbox story={expanded} onClose={closeImage} />
    </div>
  );
}
