import type { EventContentSlug, LanguageCode, PublicContentBucket } from "../types";

interface StaticPage {
  title: string;
  subtitle: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

const topBase: StaticPage = {
  title: "Grand Beatbox Battle Info Hub",
  subtitle: "Schedules, participants, venue and practical guide in one place.",
  sections: [
    {
      heading: "Event Highlights",
      body: "Fast navigation inspired by global esports portals and event competitor showcases.",
    },
    {
      heading: "Use URL Locale",
      body: "Language is controlled only by URL segments, no cookie/session dependencies.",
    },
  ],
};

const ruleBase: StaticPage = {
  title: "Rule Overview",
  subtitle: "Category definitions and judging notes",
  sections: [
    { heading: "Categories", body: "Solo, Tag Team, Crew, Loopstation and showcase flow." },
    { heading: "Judging", body: "Technique, musicality and stage presence are weighted." },
  ],
};

const travelBase: StaticPage = {
  title: "Travel Guide",
  subtitle: "How to plan local attendance",
  sections: [
    { heading: "Transport", body: "Check city pass and airport-to-venue access first." },
    { heading: "Stay", body: "Book near public transit to reduce match-day uncertainty." },
  ],
};

export function getEventStaticPage(
  _lang: LanguageCode,
  _year: number,
  content: EventContentSlug,
): StaticPage {
  const map: Record<EventContentSlug, StaticPage> = {
    top: topBase,
    ticket: {
      title: "Ticket",
      subtitle: "Entry options and venue opening times",
      sections: [{ heading: "Seat Tiers", body: "General, premium and finals access details." }],
    },
    timetable: {
      title: "Timetable",
      subtitle: "Round-by-round progression",
      sections: [{ heading: "Daily Schedule", body: "Doors, qualifiers, bracket and finals timeline." }],
    },
    stream: {
      title: "Stream",
      subtitle: "Watch options",
      sections: [{ heading: "Official Broadcast", body: "Primary channel and backup links." }],
    },
    rule: ruleBase,
    wildcards: {
      title: "Wildcards",
      subtitle: "Wildcard process and accepted clips",
      sections: [{ heading: "Selection", body: "Ranking criteria and announcement schedule." }],
    },
  };
  return map[content];
}

export function getPublicStaticPage(
  _lang: LanguageCode,
  bucket: PublicContentBucket,
  content: string,
): StaticPage {
  if (bucket === "travel") {
    return {
      ...travelBase,
      sections: [
        ...travelBase.sections,
        { heading: "Current Topic", body: `Requested content: ${content}` },
      ],
    };
  }

  return {
    title: "Other Information",
    subtitle: "Supplementary event notes",
    sections: [{ heading: "Current Topic", body: `Requested content: ${content}` }],
  };
}
