import {
  createBrowserRouter,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";

import { FALLBACK_YEAR, SUPPORTED_LOCALES } from "./config/locales";
import { getEventStaticPage, getPublicStaticPage } from "./content/pages";
import {
  fetchNotice,
  searchBeatboxerWeb,
  translateAnswer,
} from "./services/external.adapters";
import {
  getParticipantDetail,
  getParticipants,
  getTournamentResults,
  getWorldMapPoints,
  searchParticipants,
  searchSite,
  searchSuggestions,
} from "./services/db.repository";
import type { EventContentSlug, LanguageCode } from "./types";
import {
  AppLayout,
  ErrorScreen,
  NotFoundScreen,
  ParticipantDetailPage,
  ParticipantsPage,
  ResultPage,
  StaticContentPage,
  TopPage,
  WorldMapPage,
} from "./screens";

function parseLocale(langParam?: string): LanguageCode {
  if (langParam && SUPPORTED_LOCALES.includes(langParam as LanguageCode)) {
    return langParam as LanguageCode;
  }
  return "ja";
}

function parseYear(yearParam?: string): number {
  const year = Number(yearParam ?? FALLBACK_YEAR);
  return Number.isFinite(year) ? year : FALLBACK_YEAR;
}

async function rootRedirectLoader() {
  return redirect(`/ja/${FALLBACK_YEAR}/top`);
}

async function missingLocaleRedirectLoader({ params }: LoaderFunctionArgs) {
  const year = parseYear(params.year);
  const content = params.content ?? "top";
  return redirect(`/ja/${year}/${content}`);
}

async function dynamicContentLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const year = parseYear(params.year);
  const content = (params.content ?? "top") as EventContentSlug;
  const page = getEventStaticPage(lang, year, content);
  return json({ lang, year, content, page });
}

async function participantsLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const year = parseYear(params.year);
  return json({ lang, year, participants: await getParticipants(year) });
}

async function resultLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const year = parseYear(params.year);
  return json({ lang, year, results: await getTournamentResults(year) });
}

async function participantDetailLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const participantId = Number(params.participantId ?? "0");
  const mode = params.mode ?? "profile";
  const detail = await getParticipantDetail(participantId);
  if (!detail) {
    throw new Response("Not found", { status: 404 });
  }
  return json({ lang, detail, mode });
}

async function worldMapLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const year = parseYear(params.year);
  return json({ lang, year });
}

async function worldMapAction({ params }: ActionFunctionArgs) {
  const year = parseYear(params.year);
  const points = await getWorldMapPoints(year);
  return json({ points });
}

async function contentBucketLoader({ params }: LoaderFunctionArgs) {
  const lang = parseLocale(params.lang);
  const bucket = params.bucket === "travel" ? "travel" : "others";
  const content = params.content ?? "top";
  const page = getPublicStaticPage(lang, bucket, content);
  return json({ lang, page, content, bucket });
}

async function searchAction({ params, request }: ActionFunctionArgs) {
  const year = parseYear(params.year);
  const form = await request.formData();
  const query = String(form.get("query") ?? "");
  const url = await searchSite({ query, year });
  return json({ url });
}

async function searchParticipantsAction({ params, request }: ActionFunctionArgs) {
  const year = parseYear(params.year);
  const form = await request.formData();
  const query = String(form.get("query") ?? "");
  const participants = await searchParticipants({ year, query });
  return json({ participants });
}

async function searchSuggestionsAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const query = String(form.get("query") ?? "");
  const suggestions = await searchSuggestions(query);
  return json({ suggestions });
}

async function beatboxerSearchAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const keyword = String(form.get("keyword") ?? "");
  const results = await searchBeatboxerWeb(keyword);
  return json({ results });
}

async function answerTranslationAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const answer = String(form.get("answer") ?? "");
  const targetLang = String(form.get("targetLang") ?? "ja");
  const translated = await translateAnswer(answer, targetLang);
  return json({ translated });
}

async function noticeAction() {
  const message = await fetchNotice();
  return json({ message });
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, loader: rootRedirectLoader },
      { path: ":year/:content", loader: missingLocaleRedirectLoader },
      { path: ":lang/:year/top", loader: dynamicContentLoader, element: <TopPage /> },
      {
        path: ":lang/:year/:content",
        loader: dynamicContentLoader,
        element: <StaticContentPage />,
      },
      {
        path: ":lang/:year/participants",
        loader: participantsLoader,
        element: <ParticipantsPage />,
      },
      { path: ":lang/:year/result", loader: resultLoader, element: <ResultPage /> },
      {
        path: ":lang/participant_detail/:participantId/:mode",
        loader: participantDetailLoader,
        element: <ParticipantDetailPage />,
      },
      {
        path: ":lang/:year/world_map",
        loader: worldMapLoader,
        action: worldMapAction,
        element: <WorldMapPage />,
      },
      {
        path: ":lang/:bucket/:content",
        loader: contentBucketLoader,
        element: <StaticContentPage />,
      },
      { path: ":year/search", action: searchAction },
      { path: ":year/search_participants", action: searchParticipantsAction },
      { path: "search_suggestions", action: searchSuggestionsAction },
      { path: "beatboxer_tavily_search", action: beatboxerSearchAction },
      { path: "answer_translation", action: answerTranslationAction },
      { path: "notice", action: noticeAction },
      { path: "*", element: <NotFoundScreen /> },
    ],
  },
]);
