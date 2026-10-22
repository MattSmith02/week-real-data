import type { WeekEdition, WeekItem, WeekStory } from "./stories";

export type SourceBias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type CitedOutlet = {
  name: string;
  bias: SourceBias;
};

export type RealSlot = {
  slot: number;
  slotType: "post" | "text";
  slotColor: string;
  thumbnail: string;
  articleFreeTextLabel: string;
  articleName: string;
  articleStrapline: string;
  documentUrl: string;
  published_at: string;
  items?: WeekItem[];
  /** Short title for the colour card, when it should differ from the headline. */
  cardTitle?: string;
};

export type RealEdition = {
  id: number;
  documentName: string;
  subtitle: string;
  documentType: string;
  published_at: string;
  slots: RealSlot[];
};

const EDITION_URL = "/edition/theweekus-morning-report-2026-09-24-103322";
const PUBLISHED = "2026-09-24T10:33:22";

/** Morning Report for 24 September 2026, taken from the live email. */
export const REAL_EDITION: RealEdition = {
  id: 5353,
  documentName: "Morning Report",
  subtitle: "Iran’s presidential rebuttal",
  documentType: "morning",
  published_at: PUBLISHED,
  slots: [
    {
      slot: 1,
      slotType: "post",
      slotColor: "",
      thumbnail: "https://images.pexels.com/photos/6172597/pexels-photo-6172597.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      articleFreeTextLabel: "Today’s international story",
      articleName: "Iran’s president vows fight ‘until our last breath’",
      articleStrapline:
        "What happened Iranian President Masoud Pezeshkian yesterday told the United Nations General Assembly that the U.S. “hit us, but we did not bend the knee” and will defend “our beloved” homeland “until our last breath.” His “defiant speech” at the U.N.’s New York headquarters “marked a striking instance of a foreign leader addressing the world body while their country is at war with the host nation,” The Associated Press said. Pezeshkian (pictured above) held up “pictures of people killed by American and Israeli airstrikes” while “standing at the same lectern where a day earlier” President Donald Trump had “threatened to ’annihilate’ his country,’” The New York Times said. Who said what Pezeshkian accused the U.S. of violating international law with “cowardly attacks” on civilian infrastructure and said Iran would not give up its civilian nuclear program. Trump “described us as terrorists,” but Iranians are “the victims of terrorism,” Pezeshkian said. “Iran must be powerful to avoid being threatened,” and Trump and others “who seek to bully us” must understand that Iran is “ready for dialogue, diplomacy and negotiations without accepting the language of force.” Secretary of State Marco Rubio said Iran had little standing to “lecture anyone on human rights or the international system when they habitually violate it.” As Pezeshkian was speaking, “the lone American diplomat sitting in the hall left,” the Times said. What next? U.S. and Iranian officials downplayed indirect talks on the sidelines of the General Assembly. They’re “not anything new,” said Iranian Foreign Ministry spokesperson Esmail Baghaei. Rubio said holding talks was “positive” but “I don’t want to mischaracterize this as a major breakthrough.”",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 2,
      slotType: "post",
      slotColor: "",
      thumbnail: "https://images.pexels.com/photos/8898680/pexels-photo-8898680.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      articleFreeTextLabel: "Today’s press freedom story",
      articleName: "Court temporarily blocks Trump’s media ban",
      articleStrapline:
        "What happened A federal judge in Washington, D.C., early this morning ordered President Donald Trump to immediately restore White House access to Politico, CNN and MS NOW. U.S. District Judge Timothy Kelly’s 14-day restraining order is a “temporary reprieve for the three outlets” while their litigation over Trump’s press ban proceeds, The New York Times said. But Kelly said the outlets were likely to successfully show Trump denied them “constitutionally adequate due process.” Who said what The White House argued in letters Tuesday and in court yesterday that the outlets’ reporting violated national security and “widely known” journalism standards. The objection about journalistic professionalism was “so vague it hardly does the trick,” Kelly wrote, and “the court is skeptical” that Trump’s “interest in safeguarding national security is the actual motivation for, or is even advanced by,” revoking the press passes. The examples cited by the White House to shore up its case included Politico’s use of anonymous sources in an article “based on a press call the White House hosted,” The Washington Post said. “In the call, reporters were instructed to cite an anonymous ‘senior administration official,’” The Washington Post said. That official, Status reported, was Vice President JD Vance. What next? Many news organizations scaled back their “routine coverage of presidential events in solidarity with the three outlets,” the Times said. It wasn’t clear “how quickly the press corps would resume its usual coverage.”",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 3,
      slotType: "post",
      slotColor: "",
      thumbnail: "https://images.pexels.com/photos/15322664/pexels-photo-15322664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      articleFreeTextLabel: "Today’s military story",
      articleName: "China reportedly holds F-35 parts diverted to Hong Kong",
      articleStrapline:
        "What happened China’s government has taken possession of “potentially sensitive” F-35 stealth fighter jet parts “inexplicably diverted” to Hong Kong while being sent to the U.S. from Australia via UPS, Bloomberg reported yesterday, citing people familiar with the incident. The Pentagon’s F-35 Joint Program Office told Politico last week it was “aware of a shipment issue” involving F-35 parts and was “actively working” to retrieve them. Who said what The diverted cockpit canopy and weapons-bay door contain “stealth technology that only the U.S. and its allies have access to,” Politico said, citing sources, and the late May reroute “triggered an ongoing series of briefings” for congressional national security staff. The F-35 is “widely recognized as America’s best and most advanced fighter jet,” Bradley Bowman of the Foundation for Defense of Democracies said to The Associated Press. China has been “aggressively trying to get F-35 data through electronic espionage,” former congressional military analyst J.J. Gertler told Politico. But studying a part’s schematics is different than “possessing a real one.” Lockheed Martin manages the F-35 supply chain and “uses commercial shipping providers to transport parts,” Politico said. The Government Accountability Office reported in 2023 that more than 1 million F-35 parts had gone missing over the previous five years. What next? The F-35 Joint Progress Office said it was working with “industry partners” to investigate the Hong Kong diversion and “place safeguards to avoid a future occurrence.”",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 6,
      slotType: "text",
      slotColor: "#daeaf5",
      thumbnail: "",
      articleFreeTextLabel: "On this day",
      articleName: "September 24, 1968",
      cardTitle: "60 Minutes",
      articleStrapline:
        "The first episode of “60 Minutes” aired on CBS, starting a five-decade run as one of the country’s top news programs. “60 Minutes” has been undergoing significant changes under the leadership of CBS News editorial chief Bari Weiss; its recent season opener had a historically low viewership.",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 6,
      slotType: "post",
      slotColor: "",
      thumbnail: "https://images.pexels.com/photos/36376215/pexels-photo-36376215.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      articleFreeTextLabel: "Today’s newspapers",
      articleName: "‘New tone in ICE surge’",
      articleStrapline:
        "“Trump welcomes China’s Xi,” The Philadelphia Inquirer says on Thursday’s front page. “Xi pushes all-out drive to immerse China in AI,” The New York Times says. “U.S.’s AI buildout is on track as biggest-ever economic bet” as other “Western leaders make push to tame AI,” The Wall Street Journal says. “‘I am the code’: Trump and architect clashed” over White House ballroom, The Washington Post says. Trump claims ballroom needed for drone port, but “nearby drones already protect” him, says the Los Angeles Times. “Universities face cuts as foreign students flee,” the Milwaukee Journal Sentinel says. “New tone in ICE surge” as “advocates say arrests becoming more indiscriminate,” The Boston Globe says. “Judge hits 74-year-old Weinstein with 15 years behind bars in NYC sex assault case,” the New York Daily News says.",
      items: [
        { label: "The Philadelphia Inquirer", text: "Trump welcomes China’s Xi" },
        { label: "The New York Times", text: "Xi pushes all-out drive to immerse China in AI" },
        { label: "The Wall Street Journal", text: "U.S.’s AI buildout is on track as biggest-ever economic bet" },
        { label: "The Washington Post", text: "‘I am the code’: Trump and architect clashed" },
        { label: "Los Angeles Times", text: "Nearby drones already protect him" },
        { label: "Milwaukee Journal Sentinel", text: "Universities face cuts as foreign students flee" },
        { label: "The Boston Globe", text: "New tone in ICE surge" },
        { label: "New York Daily News", text: "Judge hits 74-year-old Weinstein with 15 years" },
      ],
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 4,
      slotType: "text",
      slotColor: "#ffe1e1",
      thumbnail: "",
      articleFreeTextLabel: "It's not all bad",
      articleName: "It’s not all bad",
      articleStrapline:
        "An old airport near Athens is getting new life as Europe’s second-largest city park. The 400-acre Ellinikon Park, set to open next year, is being designed to “maximize thermoregulation of the air temperature” to keep the park 7.2 degrees Fahrenheit cooler than asphalt areas, said Good News Network. More than 30,000 trees and 3 million smaller plants will cover the grounds, and misting systems will keep people and greenery cool. Concrete slabs from the airport will also be repurposed for retaining walls.",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 5,
      slotType: "post",
      slotColor: "",
      thumbnail: "https://images.pexels.com/photos/8657374/pexels-photo-8657374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      articleFreeTextLabel: "Under the radar",
      articleName: "FDA estrogen warning hit menopausal UTI care",
      articleStrapline:
        "Because of the FDA’s black-box warning for estrogen products, menopausal women spent years unable to get relief from the potentially deadly but often preventable effects of recurrent urinary tract infections. And despite growing evidence supporting safety and efficacy, as well as the lifting of the warning, a lingering stigma is still keeping women from life-saving care. For years, major medical groups have recommended a low dose of vaginal estrogen to help prevent recurrent urinary tract infections in menopausal women. But a “misinterpretation” in 2002 of a landmark research study by the Women’s Health Initiative prompted the FDA to “slap its strongest warning” on all estrogen products, said USA Today. The study suggested that some forms of hormone therapy that included estrogen and progesterone could “increase the risks of cardiovascular problems, breast cancer, endometrial cancer and possibly dementia,” said Harvard Medical School. But low-dose vaginal estrogen was never studied in the associated trial. Last November, the FDA lifted the black-box warning. Vaginal estrogen has been shown to be an effective treatment for menopausal women with frequent UTIs. In a recent study of recurrent UTIs published in the Urology Journal, “women 55 and older who were prescribed vaginal estrogen were about half as likely to be hospitalized with a UTI as those who were not,” said USA Today. Their recorded rates of sepsis and death were “roughly one-fifth as high.” Despite that evidence, treatment “still isn’t widespread” because of the continuing stigma, said USA Today. And unlike “widely prescribed” menopause hormone therapy, vaginal estrogen also suffers from a “public relations problem,” said The Center for Infectious Disease Research and Policy, with “few women knowing what it is.”",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 6,
      slotType: "text",
      slotColor: "#daeaf5",
      thumbnail: "",
      articleFreeTextLabel: "Tall tale",
      articleName: "Humble AI",
      articleStrapline:
        "After an Australian Catholic University lecturer revealed that he replaced himself with an artificial intelligence avatar, his students said they preferred the AI version. As part of an ethics lesson, Luke Rowe used his AI clone to lead a video lecture. There were glitches, like the avatar’s movements out of sync with his speech, but when Rowe disclosed what he did, students chose their AI teacher. “I was eating humble pie,” he said to The Age.",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
    {
      slot: 7,
      slotType: "text",
      slotColor: "#f0edeb",
      thumbnail: "",
      articleFreeTextLabel: "",
      articleName: "",
      articleStrapline:
        "Morning Report was written and edited by Nadia Croes, Catherine Garcia, Scott Hocker, Anya Jaremko-Greenwold, Justin Klawans, Rafi Schwartz, Peter Weber and Kari Wilkin, with illustrations by Stephen Kelly and Julia Wytrazek.",
      documentUrl: EDITION_URL,
      published_at: PUBLISHED,
    },
  ],
};

const KNOWN_OUTLETS: { pattern: RegExp; name: string; bias: SourceBias }[] = [
  { pattern: /New York Times/i, name: "The New York Times", bias: "lean-left" },
  { pattern: /Wall Street Journal/i, name: "The Wall Street Journal", bias: "center" },
  { pattern: /Washington Post/i, name: "The Washington Post", bias: "lean-left" },
  { pattern: /Philadelphia Inquirer/i, name: "The Philadelphia Inquirer", bias: "lean-left" },
  { pattern: /Los Angeles Times/i, name: "Los Angeles Times", bias: "lean-left" },
  { pattern: /Boston Globe/i, name: "The Boston Globe", bias: "left" },
  { pattern: /Milwaukee Journal Sentinel/i, name: "Milwaukee Journal Sentinel", bias: "left" },
  { pattern: /New York Daily News/i, name: "New York Daily News", bias: "left" },
  { pattern: /USA Today/i, name: "USA Today", bias: "lean-left" },
  { pattern: /Associated Press/i, name: "The Associated Press", bias: "left" },
  { pattern: /Politico/i, name: "Politico", bias: "lean-left" },
  { pattern: /Bloomberg/i, name: "Bloomberg", bias: "center" },
  { pattern: /Reuters/i, name: "Reuters", bias: "center" },
];

function citedOutlets(text: string): CitedOutlet[] {
  const seen = new Set<string>();
  return KNOWN_OUTLETS.filter((outlet) => outlet.pattern.test(text)).flatMap((outlet) => {
    if (seen.has(outlet.name)) return [];
    seen.add(outlet.name);
    return [{ name: outlet.name, bias: outlet.bias }];
  });
}

function splitSections(strap: string): { whatHappened: string; whoSaidWhat?: string; whatsNext?: string } {
  const whoSplit = strap.split(/\bWho said what\b/i);
  const whatHappened = whoSplit[0].replace(/^What happened\b/i, "").trim();
  if (whoSplit.length === 1) return { whatHappened };
  const nextSplit = whoSplit.slice(1).join("Who said what").split(/\bWhat next\??/i);
  const whoSaidWhat = nextSplit[0].trim();
  const whatsNext = nextSplit[1]?.trim();
  return {
    whatHappened,
    whoSaidWhat: whoSaidWhat || undefined,
    whatsNext: whatsNext || undefined,
  };
}

function storyShape(slot: RealSlot): { chip: string; format: WeekStory["format"]; kicker: string } {
  const label = `${slot.articleFreeTextLabel} ${slot.articleName}`.toLowerCase();
  if (label.includes("newspaper")) {
    return { chip: "Newspapers", format: "papers", kicker: slot.articleFreeTextLabel || "Today’s newspapers" };
  }
  if (label.includes("on this day")) return { chip: "On this day", format: "news", kicker: "On this day" };
  if (label.includes("tall tale")) return { chip: "Tall tale", format: "tale", kicker: "Tall tale" };
  if (label.includes("not all bad")) return { chip: "It's not all bad", format: "news", kicker: "It's not all bad" };
  if (label.includes("under the radar")) return { chip: "Under the radar", format: "news", kicker: "Under the radar" };
  return { chip: "Politics", format: "news", kicker: slot.articleFreeTextLabel || "Today’s story" };
}

function sourceFile(text: string): WeekStory["sources"] {
  const outlets = citedOutlets(text);
  return {
    outlets,
    note: outlets.length ? "" : "This excerpt does not name a rated news outlet.",
  };
}

function captionDate(published: string): string {
  const date = new Date(published.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return published;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function frontPageTitle(text: string): string {
  const day = text.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)’s front page/i);
  return day ? `${day[1]}’s front pages` : "Front pages";
}

export function realMorningEdition(edition: RealEdition = REAL_EDITION): WeekEdition {
  const pieces = edition.slots.filter((slot) => slot.articleName || slot.articleFreeTextLabel);
  const stories: WeekStory[] = pieces.map((slot, index) => {
    const shape = storyShape(slot);
    const sections = splitSections(slot.articleStrapline);
    const onThisDay = shape.chip === "On this day";
    const gradient = slot.slotColor
      ? `linear-gradient(160deg, ${slot.slotColor} 0%, #1c1814 100%)`
      : "linear-gradient(160deg, #1a2330 0%, #3d4a5c 42%, #11161c 100%)";
    const sourceText = [slot.articleStrapline, ...(slot.items ?? []).map((item) => `${item.label} ${item.text}`)].join(" ");
    return {
      id: `real-${edition.id}-${index}`,
      chip: shape.chip,
      format: shape.format,
      kicker: shape.kicker,
      displayTitle:
        index === 0
          ? edition.subtitle
          : onThisDay
            ? (slot.cardTitle ?? slot.articleName)
            : shape.format === "papers"
              ? frontPageTitle(slot.articleStrapline)
              : slot.thumbnail
                ? ""
                : slot.articleName,
      dek: onThisDay ? `${slot.articleName}: ${slot.cardTitle ?? slot.articleName}` : slot.articleName,
      menuTitle: slot.articleName,
      imageGradient: gradient,
      imageSrc: slot.thumbnail || undefined,
      imageCaption: `${edition.documentName} · ${captionDate(edition.published_at)}`,
      whatHappened: sections.whatHappened,
      whoSaidWhat: sections.whoSaidWhat,
      whatsNext: sections.whatsNext,
      statsHeading: "",
      stats: [],
      statsNote: "",
      items: slot.items,
      sources: sourceFile(sourceText),
    };
  });

  const credits = [...edition.slots].reverse().find((slot) => !slot.articleName && slot.articleStrapline);

  return {
    id: "morning",
    label: edition.documentName,
    briefing: edition.documentName,
    caughtUp: credits?.articleStrapline ?? "That’s your Morning Report.",
    stories,
  };
}
