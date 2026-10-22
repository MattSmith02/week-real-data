export type WeekStat = {
  label: string;
  value: string;
};

export type WeekItem = {
  label: string;
  text: string;
};

export type StoryFormat =
  | "news"
  | "tale"
  | "quote"
  | "day"
  | "stat"
  | "picture"
  | "puzzle"
  | "recommend"
  | "papers"
  | "cartoon";

export type SourceBias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type CitedSource = {
  name: string;
  bias: SourceBias;
};

export type StorySourceFile = {
  outlets: CitedSource[];
  /** Extra line when a citation has no AllSides rating. */
  note?: string;
};

export type WeekStory = {
  id: string;
  chip: string;
  format: StoryFormat;
  kicker: string;
  displayTitle: string;
  dek: string;
  menuTitle: string;
  imageGradient: string;
  imageSrc?: string;
  imageCaption: string;
  imageFit?: "cover" | "contain";
  /** Example clip. The article shows a still with a play control that opens the video. */
  videoSrc?: string;
  whatHappened: string;
  quote?: string;
  quoteAttribution?: string;
  whoSaidWhat?: string;
  statsHeading: string;
  stats: WeekStat[];
  statsNote: string;
  whatsNext?: string;
  items?: WeekItem[];
  sources?: StorySourceFile;
};

export type EditionId = "morning" | "evening" | "saturday" | "sunday" | "all";

export type WeekEdition = {
  id: EditionId;
  label: string;
  briefing: string;
  caughtUp: string;
  stories: WeekStory[];
};

export const WEEK_STORIES: WeekStory[] = [
  {
    id: "pike",
    chip: "Main story",
    format: "news",
    kicker: "Today's capital punishment story",
    displayTitle: "Botched execution",
    dek: "Pike ‘angry and confused’ after botched execution",
    menuTitle: "Pike ‘angry and confused’ after botched execution",
    imageGradient:
      "linear-gradient(160deg, #1a2330 0%, #3d4a5c 42%, #11161c 100%)",
    imageSrc: "/the-week/pike.jpg",
    imageCaption: "Randy Spivey, Pike’s lawyer. George Walker IV / AP",
    whatHappened:
      "Christa Pike, the Tennessee death row inmate who survived her execution last week, was “angry and confused” when she woke and began talking on Tuesday, her lawyer Randy Spivey told reporters. She has pneumonia and a blood clot in badly swollen arms, and one arm is shackled to her Nashville hospital bed despite objections from medical staff. Gov. Bill Lee paused executions in the state after Pike survived two doses of pentobarbital. Texas later executed Jamaal Howard, 46, for a 2000 murder — the 30th U.S. execution this year, and the first since Pike’s failed one.",
    quote: "Very aware that the state tried to execute her.",
    quoteAttribution: "Randy Spivey, Pike’s lawyer",
    whoSaidWhat:
      "Pike’s condition deepens the ethical and legal questions for Tennessee, The New York Times said. Lee has not answered calls to commute her sentence to life without parole, and state lawyers could not say whether Tennessee would try again. Death-penalty experts told The Associated Press they knew of no statute that explicitly bars a second attempt, but the state would be in uncharted legal territory if it tried.",
    statsHeading: "The case in numbers",
    stats: [
      { label: "Doses survived", value: "Two, of pentobarbital" },
      { label: "U.S. executions", value: "30th this year" },
      { label: "Texas execution", value: "Jamaal Howard, 46" },
      { label: "Underlying case", value: "A murder in 2000" },
    ],
    statsNote:
      "Howard’s execution was the first in the country since Pike survived hers. Tennessee has paused further executions in the state.",
    whatsNext:
      "A Tennessee judge ordered the state to preserve every record and piece of evidence from the botched execution. Pike’s lawyers said that material would matter if the state tried again.",
  },
  {
    id: "guilfoyle",
    chip: "Politics",
    format: "news",
    kicker: "Today's Trump administration story",
    displayTitle: "The ambassador’s texts",
    dek: "Trump donor says Guilfoyle pleaded for cash before job",
    menuTitle: "Trump donor says Guilfoyle pleaded for cash before job",
    imageGradient:
      "linear-gradient(160deg, #2a1d14 0%, #6b4a32 45%, #140e0b 100%)",
    imageSrc: "/the-week/guilfoyle.jpg",
    imageCaption: "Kimberly Guilfoyle. Nicolas Koutsokostas / NurPhoto via Getty Images",
    videoSrc: "/the-week/example-video.mp4",
    whatHappened:
      "Shortly before her confirmation as ambassador to Greece, Kimberly Guilfoyle asked a Trump donor for $100,000 “in a way that wouldn’t leave a paper trail,” The Wall Street Journal reported. Guilfoyle, a former fiancée of Donald Trump Jr., offered to use her sway with administration officials to help Eric Deters with tax and legal problems, the Journal said, citing Deters and their Signal chats.",
    quote: "It won’t show up anywhere if you wire money to American Express.",
    quoteAttribution: "Kimberly Guilfoyle, in a Signal chat reported by the Journal",
    whoSaidWhat:
      "“Honey please I need you to get this done for me today,” Guilfoyle wrote in July 2025. When Deters sent a letter saying he had paid her $300,000 over the years and received nothing, she told him to stop putting things on paper because it was “really dangerous.” He did not send the $100,000. The Journal said the exchange raises new questions about one of America’s most high-profile ambassadors, who is already under fire from Democrats over promoting a Greek company whose lobbyist traveled with her in the Balkans.",
    statsHeading: "The request in numbers",
    stats: [
      { label: "Asked for", value: "$100,000" },
      { label: "Deters’s claim", value: "$300,000 over the years" },
      { label: "Messages", value: "Signal, July 2025" },
      { label: "Posting", value: "Ambassador to Greece" },
    ],
    statsNote:
      "Deters did not make the $100,000 payment. Guilfoyle’s lawyer disputed that the messages were authentic, and declined to say how.",
    whatsNext:
      "Guilfoyle, through her lawyer, disputed the authenticity of the messages. The Journal said they declined to provide specifics.",
  },
  {
    id: "camp-david",
    chip: "Politics",
    format: "news",
    kicker: "Today's politics story",
    displayTitle: "A Florida Camp David",
    dek: "Trump pushes new ‘Camp David’ at his Florida club",
    menuTitle: "Trump pushes new ‘Camp David’ at his Florida club",
    imageGradient:
      "linear-gradient(160deg, #0f2418 0%, #1f6b3a 40%, #0b120e 100%)",
    imageSrc: "/the-week/camp-david.jpg",
    imageCaption:
      "Trump International Golf Club, West Palm Beach. Christopher Beckett / NurPhoto / Getty Images",
    whatHappened:
      "President Donald Trump said it would be a “great idea” to carve out a Camp David-style retreat at his golf club in West Palm Beach. Florida officials are already considering a plan, filed last month by Trump’s lawyer Harvey Oyer, to designate part of the private club a permanent sanctuary for foreign leaders and future presidents.",
    quote:
      "Just as Camp David, Windsor Castle or the Élysée Palace are known worldwide, so too will the Presidential Golf Course.",
    quoteAttribution: "Harvey Oyer, in a letter to Palm Beach County",
    whoSaidWhat:
      "Oyer called the idea a gift from Trump to future presidents. Under the proposal the club would pay for new presidential lodging and work with the government to give the federal government free access, The Associated Press said. The arrangement would tie the presidency to Trump’s business after he leaves office. The family company would keep running the club and would likely gain business if the site became a lasting presidential venue, The Washington Post said.",
    statsHeading: "The proposal",
    stats: [
      { label: "Filed", value: "Last month" },
      { label: "Site", value: "West Palm Beach club" },
      { label: "Offered as", value: "A gift to future presidents" },
      { label: "Access", value: "Free, for the government" },
    ],
    statsNote:
      "Palm Beach County leases the land to Trump. It is in contact with the General Services Administration and has started looking for a parcel.",
    whatsNext:
      "Palm Beach County is in contact with the General Services Administration and has begun plans to identify a parcel for the project, The Washington Sun said.",
  },
  {
    id: "pope",
    chip: "Religion",
    format: "news",
    kicker: "Today's religion story",
    displayTitle: "A nodule, found early",
    dek: "Pope Leo diagnosed with lung cancer after surgery",
    menuTitle: "Pope Leo diagnosed with lung cancer after surgery",
    imageGradient: "linear-gradient(160deg, #2a2418 0%, #6a5a3a 45%, #16120c 100%)",
    imageSrc: "/the-week/pope.jpg",
    imageCaption: "Pope Leo XIV",
    whatHappened:
      "Pope Leo XIV had surgery to remove a nodule in his right lung. The Vatican said the 90-minute operation was successful, with no complications, and doctors confirmed lung adenocarcinoma, the most common form of lung cancer. The lower lobe of his right lung was removed so doctors can see whether the cancer has spread.",
    quote: "Prognosis-wise, it’s very positive.",
    quoteAttribution: "Dr. Inderpal Sarkaria, to The Wall Street Journal",
    whoSaidWhat:
      "Leo has offered a rare level of transparency about the first publicly disclosed major health problem of his 17-month papacy, The Associated Press said. He told his noon prayer that a small, well-contained nodule had been found at a very early stage. If it has not metastasized, Dr. Sarkaria put recurrence-free survival at probably at least 80%. The New York Times said the diagnosis muddies the outlook for a pope whose relative youth had suggested decades on the throne.",
    statsHeading: "The diagnosis",
    stats: [
      { label: "Age", value: "71" },
      { label: "Operation", value: "90 minutes" },
      { label: "Public events", value: "Off until Oct. 20" },
      { label: "Planned trip", value: "Nov. 6" },
    ],
    statsNote:
      "He hopes to keep an 11-day trip to Uruguay, Argentina and Peru, starting November 6.",
    whatsNext:
      "Leo has canceled public events until October 20, and has said he hopes the Latin America trip still goes ahead.",
  },
  {
    id: "six-flags",
    chip: "Disaster",
    format: "news",
    kicker: "Today's disaster story",
    displayTitle: "Goliath, and nine more",
    dek: "Six Flags shutters 10 roller coasters after fatal fall",
    menuTitle: "Six Flags shutters 10 roller coasters after fatal fall",
    imageGradient: "linear-gradient(160deg, #1a120e 0%, #6a3020 45%, #120c0a 100%)",
    imageSrc: "/the-week/six-flags.jpg",
    imageCaption: "Six Flags",
    whatHappened:
      "Six Flags said it was temporarily closing nine roller coasters at six North American parks, plus Goliath at Six Flags Over Georgia, after a 42-year-old Atlanta schoolteacher fell to his death from that ride on Monday. The nine other coasters share a similar design and were suspended out of an abundance of caution, a spokesperson said.",
    quote: "Witnesses watched in horror.",
    quoteAttribution: "The Associated Press, on the fall",
    whoSaidWhat:
      "Hassan Kariem was ejected from his seat, almost seeming to hover above the car before hitting several people and falling, The Associated Press said. The Wall Street Journal said Goliath is far from the tallest or fastest coaster, and that the death lands at a make-or-break moment for Six Flags, a month after it closed the X2 coaster at Magic Mountain amid allegations of severe brain injuries.",
    statsHeading: "The closure",
    stats: [
      { label: "Coasters paused", value: "10" },
      { label: "Parks", value: "Six, plus Georgia" },
      { label: "Victim", value: "Hassan Kariem, 42" },
      { label: "Reason given", value: "An abundance of caution" },
    ],
    statsNote:
      "The nine additional coasters were closed because their design is similar to Goliath.",
  },
  {
    id: "tact",
    chip: "It's not all bad",
    format: "news",
    kicker: "It's not all bad",
    displayTitle: "A private test",
    dek: "An edible test for pregnancy, made for privacy",
    menuTitle: "An edible test for pregnancy, made for privacy",
    imageGradient:
      "linear-gradient(160deg, #3a2a22 0%, #8a5a3a 45%, #1c120e 100%)",
    imageSrc: "/the-week/section-tact.jpg",
    imageCaption: "Sneha Rao’s Tact lollipop",
    whatHappened:
      "Sneha Rao, a design student at Carnegie Mellon, is developing an edible lollipop called Tact so blind and visually impaired people can detect pregnancy themselves. If hCG is in the woman’s saliva, bumps rise on both sides of the flat sucker. It needs no one else in the room, and it leaves no trace.",
    quote:
      "I wanted to create something that focuses so much on privacy and helps them take control.",
    quoteAttribution: "Sneha Rao, to Smithsonian Magazine",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "okinawa",
    chip: "Under the radar",
    format: "news",
    kicker: "Under the radar",
    displayTitle: "Okinawa",
    dek: "Okinawa murder renews scrutiny of US military",
    menuTitle: "Okinawa murder renews scrutiny of US military",
    imageGradient:
      "linear-gradient(160deg, #1a2430 0%, #3d4a5c 42%, #11161c 100%)",
    imageSrc: "/the-week/okinawa.webp",
    imageCaption: "Yuichi Yamazaki / AFP / Getty Images",
    whatHappened:
      "The killing of a woman in Okinawa has set off protests across Japan and renewed anger over the U.S. military presence on the island. Prime Minister Sanae Takaichi asked U.S. authorities to enforce stricter discipline after what she called a brutal and heinous killing. Devin Ballard, a 20-year-old Marine, was arrested on suspicion of strangling Anna Yagi, 39, whose body was found at a hotel in Naha. He denied the allegations. Most of the 54,000 U.S. troops in Japan, and 70% of their facilities, are on Okinawa.",
    quote:
      "Tokyo has chosen the U.S.-Japan alliance over the safety and lives and voices of its people.",
    quoteAttribution: "Kozue Akibayashi, to Al Jazeera",
    whoSaidWhat:
      "Crimes by U.S. troops on Okinawa have strained Tokyo and Washington for decades. In 1995, after three servicemen raped a 12-year-old girl, tens of thousands protested for months, The Guardian said. In 2024 a teenage girl was raped by a serviceman — one of four sexual crimes linked to military personnel that year — and the anger erupted again. Akibayashi, a professor at Doshisha University, said Okinawans have objected to the bases countless times.",
    statsHeading: "The island in numbers",
    stats: [
      { label: "U.S. troops in Japan", value: "54,000" },
      { label: "Facilities on Okinawa", value: "70%" },
      { label: "Suspect", value: "A Marine, 20" },
      { label: "Victim", value: "Anna Yagi, 39" },
    ],
    statsNote:
      "Ballard stays in Japanese custody. A conviction could mean life in prison or the death penalty.",
    whatsNext:
      "Ballard will remain in Japanese custody. If convicted, he could face life in prison or the death penalty.",
  },
  {
    id: "chicago-fire",
    chip: "On this day",
    format: "news",
    kicker: "On this day",
    displayTitle: "The Great Chicago Fire",
    dek: "October 1, 1871: the Great Chicago Fire",
    menuTitle: "October 1, 1871: the Great Chicago Fire",
    imageGradient:
      "linear-gradient(160deg, #2a140e 0%, #8a3a22 45%, #140c0a 100%)",
    imageSrc: "/the-week/section-chicago-fire.jpg",
    imageCaption: "The Great Chicago Fire",
    whatHappened:
      "The Great Chicago Fire began on the property of Patrick and Catherine O’Leary. It burned for nearly three days, killed 200 to 300 people, and left about 100,000 homeless. Damage was estimated at $200 million then — about $5.4 billion now — across 4 square miles of the city.",
    statsHeading: "The fire in numbers",
    stats: [
      { label: "Burned", value: "Nearly three days" },
      { label: "Dead", value: "200 to 300" },
      { label: "Homeless", value: "About 100,000" },
      { label: "Damage today", value: "$5.4 billion" },
    ],
    statsNote: "The fire crossed about 4 square miles of Chicago.",
  },
  {
    id: "newspapers",
    chip: "Newspapers",
    format: "papers",
    kicker: "Today's newspapers",
    displayTitle: "Front pages",
    dek: "‘War turns into retreat’",
    menuTitle: "‘War turns into retreat’",
    imageGradient:
      "linear-gradient(160deg, #1c1c1c 0%, #4a4a4a 40%, #111 100%)",
    imageSrc: "/the-week/section-newspapers.jpg",
    imageCaption: "Thursday’s front pages",
    whatHappened:
      "Thursday’s front pages, as gathered in the Morning Report.",
    items: [
      { label: "The New York Times", text: "Trump’s push to war turns into retreat" },
      { label: "The Washington Post", text: "B-1 pullout shows wily tactics of a weaker foe" },
      { label: "The Wall Street Journal", text: "Tension, turnover, unmet goals bedevil Treasury under Bessent" },
      { label: "USA Today", text: "Consumer sentiment down despite positive reports" },
      { label: "The Philadelphia Inquirer", text: "Ukraine claws back land in the Donbas" },
      { label: "Houston Chronicle", text: "Israelis mourn those lost on the anniversary of the Oct. 7 attacks" },
      { label: "The Minnesota Star Tribune", text: "A foiled Mall of America mass-shooting plot" },
      { label: "The Dallas Morning News", text: "Opal Lee turns 100" },
    ],
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "tall-tale",
    chip: "Tall tale",
    format: "tale",
    kicker: "Tall tale",
    displayTitle: "Taking the high road",
    dek: "Taking the high road",
    menuTitle: "Taking the high road",
    imageGradient:
      "linear-gradient(160deg, #10243a 0%, #3a6a8a 45%, #0c1824 100%)",
    imageSrc: "/the-week/section-tall-tale.jpg",
    imageCaption: "Jake Hutzler’s commute, above Pueblo",
    whatHappened:
      "Jake Hutzler, a 28-year-old air-traffic controller, commutes one morning a week by paramotor, a motorized backpack under a paraglider wing. He flies above Pueblo, Colorado, at about 35 mph.",
    quote: "You are just sitting there in the air, with total freedom to go wherever you want.",
    quoteAttribution: "Jake Hutzler, to The Associated Press",
    statsHeading: "The commute",
    stats: [
      { label: "Age", value: "28" },
      { label: "Speed", value: "35 mph" },
      { label: "Commute", value: "One morning a week" },
      { label: "Over", value: "Pueblo, Colorado" },
    ],
    statsNote: "",
  },
];

const cream = "linear-gradient(160deg, #3a322c 0%, #6a5c50 45%, #1c1814 100%)";

export const EVENING_STORIES: WeekStory[] = [
  {
    id: "hasan",
    chip: "Talking points",
    format: "news",
    kicker: "Talking points",
    displayTitle: "A public killing, on a livestream",
    dek: "Livestreaming an execution: cruelty or added deterrent?",
    menuTitle: "Livestreaming an execution: cruelty or added deterrent?",
    imageGradient: cream,
    imageSrc: "/the-week/hasan.webp",
    imageCaption: "The U.S. plans to broadcast an execution",
    whatHappened:
      "Nearly a century after its last public execution, the U.S. government said it will broadcast the December execution of Nidal Hasan, a former army officer convicted over the 2009 mass shooting at Fort Hood. Defense Secretary Pete Hegseth said Hasan will be killed by firing squad, and that the government intends the killing to be public.",
    quote: "Make sure people are able to watch it, that it’s public.",
    quoteAttribution: "Pete Hegseth",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "tupac-quote",
    chip: "Quote of the day",
    format: "quote",
    kicker: "Quote of the day",
    displayTitle: "Judge Carli Kierny, sentencing Tupac’s killer",
    dek: "‘You don’t get to just walk away from it’",
    menuTitle: "‘You don’t get to just walk away from it’",
    imageGradient: cream,
    imageSrc: "/the-week/section-quote.jpg",
    imageCaption: "Quote of the day",
    whatHappened:
      "Judge Carli Kierny was speaking to Duane “Keffe D” Davis before sentencing him to a minimum of 40 years for first-degree murder and use of a deadly weapon in the 1996 shooting of Tupac Shakur. Davis, 63, said he will appeal.",
    quote:
      "You don’t get to take a man from his family. You don’t get to take his very life, his whole future from him, and just walk away from it. Especially when that man is Tupac Shakur.",
    quoteAttribution: "Judge Carli Kierny",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "texas-gov",
    chip: "Big question",
    format: "news",
    kicker: "Today's big question",
    displayTitle: "Hinojosa, Abbott, and a tied race",
    dek: "Can a Democrat win the Texas governor’s race?",
    menuTitle: "Can a Democrat win the Texas governor’s race?",
    imageGradient: cream,
    imageSrc: "/the-week/texas.jpg",
    imageCaption: "Gina Hinojosa",
    whatHappened:
      "James Talarico is not the only Democrat with a shot in Texas. Polls show Gina Hinojosa, helped by Latino voters and a backlash against data centers, running neck and neck with longtime Republican governor Greg Abbott.",
    whoSaidWhat:
      "Commentators called the Hinojosa–Abbott race statistically tied heading into the final weeks.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "snap",
    chip: "Statistic",
    format: "stat",
    kicker: "Statistic of the day",
    displayTitle: "Americans who have lost SNAP benefits",
    dek: "5 million",
    menuTitle: "5 million have lost SNAP benefits",
    imageGradient: cream,
    imageSrc: "/the-week/section-snap.jpg",
    imageCaption: "Statistic of the day",
    whatHappened:
      "About 5 million Americans have lost SNAP benefits since the One Big Beautiful Bill Act passed in 2025, a 13% drop year over year, the U.S. Department of Agriculture said. Arizona has had the largest loss so far, at 50%.",
    statsHeading: "",
    stats: [
      { label: "Lost SNAP benefits", value: "5 million" },
      { label: "Year over year", value: "13% drop" },
      { label: "Largest state loss", value: "Arizona, 50%" },
      { label: "Source", value: "U.S.D.A." },
    ],
    statsNote:
      "The figure is the approximate number who have lost benefits since the 2025 law.",
  },
  {
    id: "lithuania",
    chip: "Explainer",
    format: "news",
    kicker: "In the spotlight",
    displayTitle: "A drone, an airport, a NATO ask",
    dek: "Drones and drills: why Lithuania feels vulnerable",
    menuTitle: "Drones and drills: why Lithuania feels vulnerable",
    imageGradient: cream,
    imageSrc: "/the-week/lithuania.jpg",
    imageCaption: "Lithuania",
    whatHappened:
      "After the country’s largest airport closed over a suspected drone attack thought to have come from Belarus, Lithuania’s prime minister asked NATO for a plan to answer Russia’s hybrid warfare. Politico said he warned that Moscow is ready to test the alliance as incidents spread beyond Europe’s eastern flank.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "good-bad",
    chip: "Good / bad day",
    format: "day",
    kicker: "Good day / Bad day",
    displayTitle: "Horses in the park, pubs on the slide",
    dek: "A good day for horses. A bad day for pubs.",
    menuTitle: "A good day for horses. A bad day for pubs.",
    imageGradient: cream,
    imageSrc: "/the-week/section-good-bad.jpg",
    imageCaption: "Good day / Bad day",
    whatHappened: "",
    items: [
      {
        label: "Good day",
        text: "For New York horses. Mayor Zohran Mamdani has a deal to ban horse-drawn carriages in Central Park from 2028, Politico reported. Activists have fought the 150-year city staple for years.",
      },
      {
        label: "Bad day",
        text: "For British pubs. A bar in the U.K. closes every day, the British Beer and Pub Association said. 295 shut for good in the first nine months of 2026, and the year is expected to reach at least 360.",
      },
    ],
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "meeting-place",
    chip: "Picture of the day",
    format: "picture",
    kicker: "Picture of the day",
    displayTitle: "Animals in their Environment",
    dek: "‘The Meeting Place’",
    menuTitle: "‘The Meeting Place’",
    imageGradient: cream,
    imageSrc: "/the-week/meeting-place.jpg",
    imageCaption: "James Lewin / Wildlife Photographer of the Year",
    whatHappened:
      "A young bull elephant sprays zebras at a watering hole in Kenya’s Chyulu Hills. James Lewin’s photograph topped the Animals in their Environment category of the Wildlife Photographer of the Year competition.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "sudoku",
    chip: "Puzzle",
    format: "puzzle",
    kicker: "Puzzles",
    displayTitle: "Also in puzzles: guess the number",
    dek: "Daily sudoku",
    menuTitle: "Daily sudoku",
    imageGradient: cream,
    imageSrc: "/the-week/sudoku.webp",
    imageFit: "contain",
    imageCaption: "The Week’s daily sudoku",
    whatHappened:
      "The Evening Review points readers to the daily sudoku, alongside guess the number, in the puzzles section.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "cajun",
    chip: "Recommends",
    format: "recommend",
    kicker: "The Week recommends",
    displayTitle: "Donald Link on rice, pork, and the bayou",
    dek: "A book for cooking like a Cajun",
    menuTitle: "A book for cooking like a Cajun",
    imageGradient: cream,
    imageSrc: "/the-week/cajun.jpg",
    imageCaption: "Real Cajun, by Donald Link",
    whatHappened:
      "Chef Donald Link writes that his most cherished food memories involve rice and pork. Real Cajun: Rustic Home Cooking stays with the food of southern Louisiana: eggplant dressing, dirty rice with chicken livers, crawfish pies, and cracklins.",
    quote: "My most cherished food memories involve two ingredients: rice and pork.",
    quoteAttribution: "Donald Link, Real Cajun",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "omar",
    chip: "Commentary",
    format: "news",
    kicker: "Instant opinion",
    displayTitle: "Sara Pequeño in USA Today",
    dek: "‘Ilhan Omar raid is Trump’s playbook’",
    menuTitle: "‘Ilhan Omar raid is Trump’s playbook’",
    imageGradient: cream,
    imageSrc: "/the-week/section-omar.jpg",
    imageCaption: "Today’s best commentary",
    whatHappened:
      "Sara Pequeño writes in USA Today that the public humiliation of Rep. Ilhan Omar is not an outlier. She calls it the point of Trump’s presidency, and the Republican way of politics.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
];

export const SATURDAY_STORIES: WeekStory[] = [
  {
    id: "cornell",
    chip: "Main story",
    format: "news",
    kicker: "Controversy of the week",
    displayTitle: "A case reopened, late",
    dek: "Cornell: is justice possible in an alleged gang rape case?",
    menuTitle: "Cornell: is justice possible in an alleged gang rape case?",
    imageGradient: cream,
    imageSrc: "/the-week/cornell.jpg",
    imageCaption: "Cornell",
    whatHappened:
      "Matthew Van Houten, district attorney for New York’s Tompkins County, agreed to reopen a criminal investigation into an alleged 2024 sexual assault at Cornell, after a firestorm of outrage.",
    quote: "Too little, too late.",
    quoteAttribution: "Mimi Rocah, former federal prosecutor, in MS.now",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "viewpoint",
    chip: "Viewpoint",
    format: "quote",
    kicker: "Viewpoint",
    displayTitle: "President Trump, on intelligence and hoaxes",
    dek: "Trump derangement syndrome",
    menuTitle: "Trump derangement syndrome",
    imageGradient: cream,
    imageSrc: "/the-week/section-viewpoint.jpg",
    imageCaption: "Viewpoint",
    whatHappened:
      "In a Saturday Wrap viewpoint, President Trump recast artificial intelligence as “super intelligence,” then folded climate change, Russia, and Ukraine into a list of things he called hoaxes.",
    quote:
      "I don’t call it artificial intelligence anymore. It’s going to be super intelligence.",
    quoteAttribution: "Donald Trump",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "elnino",
    chip: "Briefing",
    format: "news",
    kicker: "Briefing",
    displayTitle: "Heat already in the Pacific",
    dek: "El Niño turns ‘super’",
    menuTitle: "El Niño turns ‘super’",
    imageGradient: cream,
    imageSrc: "/the-week/elnino.jpg",
    imageCaption: "El Niño",
    whatHappened:
      "A powerful form of the climate pattern is already producing extreme weather, and it is only getting started. This El Niño is different because of how much heat has built up in the Pacific. The pattern returns every few years when the trade winds that usually blow west weaken.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "only-america",
    chip: "Only in America",
    format: "news",
    kicker: "Only in America",
    displayTitle: "Texas rewrites a lesson",
    dek: "Only in America",
    menuTitle: "Only in America",
    imageGradient: cream,
    imageSrc: "/the-week/section-only-america.jpg",
    imageCaption: "Only in America",
    whatHappened:
      "Texas high school students will be taught that the Prophet Mohammed was a brutal warrior who spread Islam through violence and slavery, under new social studies standards from the state Board of Education. Proposed lessons on Muslim contributions to algebra and astronomy were voted down. Board chair Aaron Kinsey said critics are trying to make the standards seem more divisive.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "comando",
    chip: "It wasn't all bad",
    format: "tale",
    kicker: "It wasn't all bad",
    displayTitle: "The smallest recruit",
    dek: "It wasn’t all bad",
    menuTitle: "It wasn’t all bad",
    imageGradient: cream,
    imageSrc: "/the-week/section-comando.jpg",
    imageCaption: "Comando, of Mexico’s National Guard",
    whatHappened:
      "An 8-inch Chihuahua named Comando joined Mexico’s National Guard after his elderly owners could no longer care for him. At 13 months, he is the smallest dog on the force’s 350-strong canine search-and-rescue team.",
    statsHeading: "The recruit",
    stats: [
      { label: "Height", value: "8 inches" },
      { label: "Age", value: "13 months" },
      { label: "Unit", value: "Search and rescue" },
      { label: "Pack", value: "350 dogs" },
    ],
    statsNote: "",
  },
  {
    id: "pike-saturday",
    chip: "Talking points",
    format: "news",
    kicker: "Talking points",
    displayTitle: "Doctors had to save her",
    dek: "Christa Pike: an inhumane execution attempt?",
    menuTitle: "Christa Pike: an inhumane execution attempt?",
    imageGradient: cream,
    imageSrc: "/the-week/pike.jpg",
    imageCaption: "Christa Pike’s case, in Saturday Wrap",
    whatHappened:
      "Doctors in Tennessee had to save the life of a woman the state had just tried to kill, Doreen St. Félix wrote in The New Yorker. After the Supreme Court cleared the way, Christa Pike, 50, was strapped to a gurney at Riverbend prison in Nashville for a lethal injection she survived.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "stallone",
    chip: "People",
    format: "news",
    kicker: "People",
    displayTitle: "Raised by strangers",
    dek: "Stallone’s cruel childhood",
    menuTitle: "Stallone’s cruel childhood",
    imageGradient: cream,
    imageSrc: "/the-week/stallone.jpg",
    imageCaption: "Sylvester Stallone",
    whatHappened:
      "Sylvester Stallone needed a Rocky-like will to get through childhood, Lulu Garcia-Navarro wrote in The New York Times. At 2 he was left at a boardinghouse in Queens by his former chorus-girl mother and hairdresser father. They collected him four years later. He is now 80.",
    quote: "I was raised by strangers.",
    quoteAttribution: "Sylvester Stallone, to The New York Times",
    whoSaidWhat:
      "His parents were never nurturing, he said, so the boardinghouse was a bonus compared with what came next.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
];

export const SUNDAY_STORIES: WeekStory[] = [
  {
    id: "musk-film",
    chip: "Film review",
    format: "news",
    kicker: "Film review",
    displayTitle: "Alex Gibney’s four-hour portrait",
    dek: "Musk",
    menuTitle: "Musk",
    imageGradient: cream,
    imageSrc: "/the-week/musk.jpg",
    imageCaption: "Musk",
    whatHappened:
      "Alex Gibney’s documentary, close to four hours, has drawn insults and legal threats from its subject. The Sunday Shortlist calls it a damning portrait of the world’s richest man, and gives it three stars out of four.",
    quote: "As a character study, Musk is fascinating. As a warning about our future, it’s terrifying.",
    quoteAttribution: "Bilge Ebiri, NYMag.com",
    statsHeading: "The review",
    stats: [{ label: "Stars", value: "★★★" }, { label: "Length", value: "Nearly 4 hours" }],
    statsNote: "Out of four stars.",
  },
  {
    id: "diplomat",
    chip: "TV review",
    format: "news",
    kicker: "TV review",
    displayTitle: "Season 4",
    dek: "The Diplomat",
    menuTitle: "The Diplomat",
    imageGradient: cream,
    imageSrc: "/the-week/diplomat.jpg",
    imageCaption: "Keri Russell in The Diplomat",
    whatHappened:
      "International diplomacy is hard. Marital diplomacy is often harder. Season 4 opens soon after a nuclear-armed Russian submarine disappears off the British coast. That is bad for London and Moscow, and a harder problem for Keri Russell’s ambassador.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "bordeaux",
    chip: "Food & drink",
    format: "recommend",
    kicker: "Food & drink",
    displayTitle: "Ray Isle, in Food & Wine",
    dek: "Wine: Bordeaux bargains",
    menuTitle: "Wine: Bordeaux bargains",
    imageGradient: cream,
    imageSrc: "/the-week/section-bordeaux.jpg",
    imageCaption: "Bordeaux, below the famous prices",
    whatHappened:
      "Many great Bordeaux wines cost nothing like the three-figure bottles from the famous châteaus, Ray Isle wrote in Food & Wine. The region makes a lot of cabernet and merlot, and several good vintages are on shelves now. One he flags: the 2022 Château de Fontenille Cadillac Côtes de Bordeaux, a half-and-half cabernet–merlot, at $25.",
    statsHeading: "",
    stats: [{ label: "The bottle", value: "$25" }, { label: "Vintage", value: "2022" }],
    statsNote: "Château de Fontenille Cadillac Côtes de Bordeaux.",
  },
  {
    id: "millionaire",
    chip: "Book",
    format: "news",
    kicker: "Book of the week",
    displayTitle: "Owen Zidar and Eric Zwick",
    dek: "The Everywhere Millionaire",
    menuTitle: "The Everywhere Millionaire",
    imageGradient: cream,
    imageSrc: "/the-week/millionaire.jpg",
    imageCaption: "The Everywhere Millionaire",
    whatHappened:
      "When wealth comes up, the talk is usually about billionaires. John Lanchester, in The New Yorker, asks what if another group had quietly grown 13 times richer than the Forbes 400. Zidar and Zwick look at America’s Main Street millionaires.",
    quote: "When we talk about wealth, mainly we talk about billionaires.",
    quoteAttribution: "John Lanchester, The New Yorker",
    statsHeading: "The claim",
    stats: [{ label: "Versus the Forbes 400", value: "13× richer" }],
    statsNote: "Together, the group the authors describe.",
  },
  {
    id: "hastert",
    chip: "Obituary",
    format: "news",
    kicker: "Obituary",
    displayTitle: "Speaker, then disgrace",
    dek: "The GOP House speaker who abused teen boys",
    menuTitle: "The GOP House speaker who abused teen boys",
    imageGradient: cream,
    imageSrc: "/the-week/hastert.jpg",
    imageCaption: "Dennis Hastert",
    whatHappened:
      "Dennis Hastert rose to speaker of the House on a reputation for moral rectitude, then left office disgraced by revelations that he had sexually abused teenage boys. A former high-school wrestling coach, the Illinois congressman was elevated in 1999 after Bob Livingston, in line for the job, stepped aside.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
  {
    id: "cartoon",
    chip: "Cartoon",
    format: "cartoon",
    kicker: "Cartoons",
    displayTitle: "Thursday’s roundup",
    dek: "Political cartoons for October 15",
    menuTitle: "Political cartoons for October 15",
    imageGradient: "#F4F0EA",
    imageSrc: "/the-week/cartoon-oct15.jpg",
    imageFit: "contain",
    imageCaption: "The Week cartoons",
    whatHappened:
      "Thursday’s political cartoons include changing colors, changing lighting, and more.",
    statsHeading: "",
    stats: [],
    statsNote: "",
  },
];

export const STORY_SOURCES: Record<string, StorySourceFile> = {
  pike: {
    outlets: [
      { name: "The New York Times", bias: "lean-left" },
      { name: "The Associated Press", bias: "left" },
    ],
  },
  guilfoyle: {
    outlets: [{ name: "The Wall Street Journal", bias: "center" }],
  },
  "camp-david": {
    outlets: [
      { name: "The Associated Press", bias: "left" },
      { name: "The Washington Post", bias: "lean-left" },
    ],
    note: "The article also cites “The Washington Sun”; its publisher identity and rating are unconfirmed.",
  },
  pope: {
    outlets: [
      { name: "The Associated Press", bias: "left" },
      { name: "The New York Times", bias: "lean-left" },
      { name: "The Wall Street Journal", bias: "center" },
    ],
  },
  "six-flags": {
    outlets: [
      { name: "The Associated Press", bias: "left" },
      { name: "The Wall Street Journal", bias: "center" },
    ],
  },
  tact: {
    outlets: [],
    note: "The article cites Smithsonian Magazine; its publisher rating is unconfirmed.",
  },
  okinawa: {
    outlets: [
      { name: "The Guardian", bias: "lean-left" },
      { name: "Al Jazeera", bias: "lean-left" },
    ],
  },
  newspapers: {
    outlets: [
      { name: "The New York Times", bias: "lean-left" },
      { name: "The Washington Post", bias: "lean-left" },
      { name: "The Wall Street Journal", bias: "center" },
      { name: "USA Today", bias: "lean-left" },
      { name: "The Philadelphia Inquirer", bias: "lean-left" },
      { name: "Houston Chronicle", bias: "lean-left" },
      { name: "The Minnesota Star Tribune", bias: "lean-left" },
      { name: "The Dallas Morning News", bias: "right" },
    ],
  },
  "tall-tale": {
    outlets: [{ name: "The Associated Press", bias: "left" }],
  },
  lithuania: {
    outlets: [{ name: "Politico", bias: "lean-left" }],
  },
  "good-bad": {
    outlets: [{ name: "Politico", bias: "lean-left" }],
    note: "The article also cites the British Beer and Pub Association, which is not a rated news outlet.",
  },
  snap: {
    outlets: [],
    note: "The figure comes from the U.S. Department of Agriculture, which is not a rated news outlet.",
  },
  omar: {
    outlets: [{ name: "USA Today", bias: "lean-left" }],
  },
  cornell: {
    outlets: [],
    note: "The article cites “MS.now”; its publisher identity and rating are unconfirmed.",
  },
  "pike-saturday": {
    outlets: [{ name: "The New Yorker", bias: "left" }],
  },
  stallone: {
    outlets: [{ name: "The New York Times", bias: "lean-left" }],
  },
  "musk-film": {
    outlets: [{ name: "New York Magazine", bias: "left" }],
  },
  bordeaux: {
    outlets: [],
    note: "The article cites Food & Wine; its publisher rating is unconfirmed.",
  },
  millionaire: {
    outlets: [{ name: "The New Yorker", bias: "left" }],
  },
};

export const ALL_STORIES: WeekStory[] = [
  ...WEEK_STORIES,
  ...EVENING_STORIES,
  ...SATURDAY_STORIES,
  ...SUNDAY_STORIES,
];

export const EDITIONS: WeekEdition[] = [
  {
    id: "morning",
    label: "Morning Report",
    briefing: "Morning Report",
    caughtUp: "That’s your Morning Report.",
    stories: WEEK_STORIES,
  },
  {
    id: "evening",
    label: "Evening Review",
    briefing: "Evening Review",
    caughtUp: "That’s your Evening Review.",
    stories: EVENING_STORIES,
  },
  {
    id: "saturday",
    label: "Saturday Wrap",
    briefing: "Saturday Wrap",
    caughtUp: "That’s your Saturday Wrap.",
    stories: SATURDAY_STORIES,
  },
  {
    id: "sunday",
    label: "Sunday Shortlist",
    briefing: "Sunday Shortlist",
    caughtUp: "That’s your Sunday Shortlist.",
    stories: SUNDAY_STORIES,
  },
  {
    id: "all",
    label: "All",
    briefing: "All editions",
    caughtUp: "That’s every section, from morning through Sunday.",
    stories: ALL_STORIES,
  },
];

export const MENU_EDITIONS: {
  id: EditionId;
  place: "Latest" | "Previous";
  label: string;
  when: string;
  headline: string;
  image: string;
}[] = [
  {
    id: "sunday",
    place: "Latest",
    label: "Sunday Shortlist",
    when: "Sun 11 October",
    headline: "What we lose when local news disappears",
    image: "/the-week/hero-sunday-field.jpg",
  },
  {
    id: "saturday",
    place: "Previous",
    label: "Saturday Wrap",
    when: "Sat 10 October",
    headline: "The week the shutdown clock ran out",
    image: "/the-week/hero-saturday-field.jpg",
  },
];
