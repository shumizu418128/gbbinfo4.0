import { Form, Link, Outlet, useFetcher, useLoaderData, useRouteError } from "react-router-dom";
import { useMemo } from "react";

import { FALLBACK_YEAR, LANGUAGE_LABELS, SUPPORTED_LOCALES } from "./config/locales";
import type { Participant, TournamentResult, WorldMapPoint } from "./types";

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="hero-header">
        <p className="hero-tag">GBBINFO 4.0</p>
        <h1>Global Battle Portal</h1>
        <p className="hero-copy">
          Competitor-first UI inspired by modern esports schedule hubs and event competitor showcases.
        </p>
      </header>
      <nav className="main-nav">
        <Link to={`/ja/${FALLBACK_YEAR}/top`}>Top</Link>
        <Link to={`/ja/${FALLBACK_YEAR}/participants`}>Participants</Link>
        <Link to={`/ja/${FALLBACK_YEAR}/result`}>Result</Link>
        <Link to={`/ja/${FALLBACK_YEAR}/world_map`}>World Map</Link>
        <Link to={`/ja/travel/top`}>Travel</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function TopPage() {
  const data = useLoaderData() as {
    lang: string;
    year: number;
    page: { title: string; subtitle: string; sections: Array<{ heading: string; body: string }> };
  };

  return (
    <section className="glass-card">
      <h2>{data.page.title}</h2>
      <p className="muted">{data.page.subtitle}</p>
      <LanguageRail />
      <SearchPanel year={data.year} />
      <SectionGrid sections={data.page.sections} />
    </section>
  );
}

export function StaticContentPage() {
  const data = useLoaderData() as {
    page: { title: string; subtitle: string; sections: Array<{ heading: string; body: string }> };
  };

  return (
    <section className="glass-card">
      <h2>{data.page.title}</h2>
      <p className="muted">{data.page.subtitle}</p>
      <SectionGrid sections={data.page.sections} />
    </section>
  );
}

export function ParticipantsPage() {
  const data = useLoaderData() as { participants: Participant[]; year: number };
  const searchFetcher = useFetcher<{ participants: Participant[] }>();
  const actionParticipants = searchFetcher.data?.participants ?? data.participants;

  return (
    <section className="glass-card">
      <h2>Participants</h2>
      <searchFetcher.Form method="post" action={`/${data.year}/search_participants`} className="search-row">
        <input name="query" placeholder="Search participant" />
        <button type="submit">Search</button>
      </searchFetcher.Form>
      <div className="grid-cards">
        {actionParticipants.map((p) => (
          <article className="tile" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.country}</p>
            <p className="muted">{p.category}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ResultPage() {
  const data = useLoaderData() as { results: TournamentResult[] };
  return (
    <section className="glass-card">
      <h2>Result</h2>
      <div className="grid-cards">
        {data.results.map((result) => (
          <article className="tile" key={`${result.year}-${result.category}`}>
            <h3>{result.category}</h3>
            <p>Champion: {result.champion}</p>
            <p>Runner-up: {result.runnerUp}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ParticipantDetailPage() {
  const data = useLoaderData() as { detail: Participant; mode: string };

  return (
    <section className="glass-card">
      <h2>{data.detail.name}</h2>
      <p>{data.detail.country}</p>
      <p>{data.detail.crew}</p>
      <p className="muted">mode: {data.mode}</p>
    </section>
  );
}

export function WorldMapPage() {
  const data = useLoaderData() as { year: number };
  const fetcher = useFetcher<{ points: WorldMapPoint[] }>();
  const points = fetcher.data?.points ?? [];
  const pointCount = useMemo(() => points.length, [points]);

  return (
    <section className="glass-card">
      <h2>World Map</h2>
      <p className="muted">JS map rendering + action based data loading (Hyperdrive path in production).</p>
      <fetcher.Form method="post" className="search-row">
        <button type="submit">Load Map Data ({data.year})</button>
      </fetcher.Form>
      <div className="map-placeholder">
        <p>Loaded Points: {pointCount}</p>
        <svg viewBox="0 0 1000 500" className="world-canvas" role="img" aria-label="World map data points">
          <rect x="0" y="0" width="1000" height="500" fill="rgba(255,255,255,0.04)" />
          {points.map((point) => {
            const x = ((point.lng + 180) / 360) * 1000;
            const y = ((90 - point.lat) / 180) * 500;
            return (
              <g key={`map-dot-${point.id}`}>
                <circle cx={x} cy={y} r="8" fill="#64d2ff" />
                <text x={x + 10} y={y - 10} fill="#f5f6ff" fontSize="16">
                  {point.title}
                </text>
              </g>
            );
          })}
        </svg>
        {points.map((point) => (
          <article className="map-point" key={point.id}>
            <strong>{point.title}</strong> ({point.lat}, {point.lng})
          </article>
        ))}
      </div>
    </section>
  );
}

export function NotFoundScreen() {
  return (
    <section className="glass-card">
      <h2>404</h2>
      <p>Requested page was not found.</p>
      <Link to={`/ja/${FALLBACK_YEAR}/top`}>Back to top</Link>
    </section>
  );
}

export function ErrorScreen() {
  const error = useRouteError() as Error;
  return (
    <section className="glass-card">
      <h2>Application Error</h2>
      <p>{error?.message ?? "Unexpected error"}</p>
      <Link to={`/ja/${FALLBACK_YEAR}/top`}>Back to top</Link>
    </section>
  );
}

function LanguageRail() {
  return (
    <div className="language-rail">
      {SUPPORTED_LOCALES.slice(0, 8).map((lang) => (
        <span key={lang}>{LANGUAGE_LABELS[lang]}</span>
      ))}
    </div>
  );
}

function SectionGrid({ sections }: { sections: Array<{ heading: string; body: string }> }) {
  return (
    <div className="grid-cards">
      {sections.map((section) => (
        <article className="tile" key={section.heading}>
          <h3>{section.heading}</h3>
          <p>{section.body}</p>
        </article>
      ))}
    </div>
  );
}

export function SearchPanel({ year }: { year: number }) {
  const searchFetcher = useFetcher<{ url: string }>();
  const suggestionFetcher = useFetcher<{ suggestions: string[] }>();

  return (
    <section className="glass-card">
      <h2>Quick Search</h2>
      <Form method="post" action={`/${year}/search`} className="search-row">
        <input name="query" placeholder="Search schedule / participants / result" />
        <button type="submit">Go</button>
      </Form>
      <suggestionFetcher.Form method="post" action="/search_suggestions" className="search-row">
        <input name="query" placeholder="Suggestion keyword" />
        <button type="submit">Suggest</button>
      </suggestionFetcher.Form>
      {suggestionFetcher.data?.suggestions?.length ? (
        <div className="suggestion-row">
          {suggestionFetcher.data.suggestions.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      {searchFetcher.data?.url ? <p className="muted">Suggested URL: {searchFetcher.data.url}</p> : null}
    </section>
  );
}
