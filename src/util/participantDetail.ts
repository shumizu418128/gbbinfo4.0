import { locales } from "@paraglide/runtime.js";
import {
  isSupportedLanguage,
  type SupportedLanguage,
} from "~/constants/languageLabels.js";
import {
  type ParticipantType,
} from "~/constants/participantType.js";
import {
  computePastYearParticipation,
  type ParticipantDetailMember,
  type ParticipantDetailParticipant,
} from "~/db/participant.js";
import {
  findAllParticipantDetailPathsFromStore,
  findParticipantDetailFromStore,
  findPastParticipationFromStore,
  findSameYearCategoryPeersFromStore,
  findTavilyFromStore,
  getCommonYearDataFromStore,
  loadBuildCache,
  type BuildCacheStore,
} from "~/db/buildCache.js";
import { getCommonYearData, type CommonYearData } from "~/util/staticPaths.js";
import {
  buildProcessedBeatboxerSearch,
  type ProcessedBeatboxerSearch,
} from "~/util/beatboxerSearchResults.js";
import { isUnknownParticipantName } from "~/util/participant.js";
import { toTavilyCacheKey } from "~/util/tavily.js";

export type ParticipantDetailPageData = {
  locale: SupportedLanguage;
  type: ParticipantType;
  participant: ParticipantDetailParticipant | null;
  member: ParticipantDetailMember | null;
  displayName: string;
  year: number;
  categoryId: number;
  categoryName: string;
  participantId: number;
  isCancelled: boolean;
  ticketClass: string;
  pastParticipation: Awaited<
    ReturnType<typeof findPastParticipationFromStore>
  >;
  pastYearParticipation: number[];
  sameYearCategoryPeers: Awaited<
    ReturnType<typeof findSameYearCategoryPeersFromStore>
  >;
  tavily: ProcessedBeatboxerSearch;
  common: CommonYearData;
};

/**
 * スナップショットから出場者詳細ページ用データを組み立てる。
 *
 * Args:
 *   store: ビルドキャッシュストア。
 *   locale: 表示言語。
 *   id: Participant または ParticipantMember の ID。
 *   type: single / team / member。
 *
 * Returns:
 *   詳細ページ props。
 *
 * Raises:
 *   Error: 出場者が存在しない場合。
 */
export const buildPageDataFromStore = async (
  store: BuildCacheStore,
  locale: SupportedLanguage,
  id: number,
  type: ParticipantType,
): Promise<ParticipantDetailPageData> => {
  const detailResult = findParticipantDetailFromStore(store, id, type);

  let displayName: string;
  let year: number;
  let categoryId: number;
  let categoryName: string;
  let participantId: number;
  let isCancelled: boolean;
  let ticketClass: string;
  let participant: ParticipantDetailParticipant | null = null;
  let member: ParticipantDetailMember | null = null;

  if (detailResult.type === "member") {
    member = detailResult.data;
    participant = member.participantInfo;
    displayName = member.name;
    year = participant.year;
    categoryId = participant.category;
    categoryName = participant.categoryInfo.name;
    participantId = participant.id;
    isCancelled = participant.isCancelled;
    ticketClass = participant.ticketClass;
  } else {
    participant = detailResult.data;
    displayName = participant.name;
    year = participant.year;
    categoryId = participant.category;
    categoryName = participant.categoryInfo.name;
    participantId = participant.id;
    isCancelled = participant.isCancelled;
    ticketClass = participant.ticketClass;
  }

  if (isUnknownParticipantName(displayName)) {
    throw new Error(`Participant name is unknown: id=${id}`);
  }

  const pastParticipation = findPastParticipationFromStore(store, displayName);
  const sameYearCategoryPeers = findSameYearCategoryPeersFromStore(
    store,
    year,
    categoryId,
    participantId,
  );
  const tavilyRow = findTavilyFromStore(
    store,
    toTavilyCacheKey(displayName),
  );
  const common = getCommonYearDataFromStore(store, year);
  const pastYearParticipation = computePastYearParticipation(
    pastParticipation,
    year,
  );
  const tavily = buildProcessedBeatboxerSearch(tavilyRow, locale, displayName);

  return {
    locale,
    type,
    participant,
    member,
    displayName,
    year,
    categoryId,
    categoryName,
    participantId,
    isCancelled,
    ticketClass,
    pastParticipation,
    pastYearParticipation,
    sameYearCategoryPeers,
    tavily,
    common,
  };
};

/**
 * 出場者詳細ページ用のビルド時データをまとめて取得する。
 *
 * ビルドキャッシュが無い場合のみ DB にフォールバックする（dev 用）。
 *
 * Args:
 *   locale: 表示言語。
 *   id: Participant または ParticipantMember の ID。
 *   type: single / team / member。
 *
 * Returns:
 *   詳細ページ props。
 *
 * Raises:
 *   Error: 出場者が存在しない場合。
 */
export const loadParticipantDetailPageData = async (
  locale: SupportedLanguage,
  id: number,
  type: ParticipantType,
): Promise<ParticipantDetailPageData> => {
  const store = loadBuildCache();
  if (store) {
    return buildPageDataFromStore(store, locale, id, type);
  }

  const { findParticipantDetail, findPastParticipation, findSameYearCategoryPeers } =
    await import("~/db/participant.js");
  const { findTavilyDataForPage } = await import("~/db/tavily.js");

  const detailResult = await findParticipantDetail(id, type);

  if (detailResult.type === "member") {
    const memberData = detailResult.data;
    const participantData = memberData.participantInfo;
    const displayName = memberData.name;

    if (isUnknownParticipantName(displayName)) {
      throw new Error(`Participant name is unknown: id=${id}`);
    }

    const [pastParticipation, sameYearCategoryPeers, tavilyRow, common] =
      await Promise.all([
        findPastParticipation(displayName),
        findSameYearCategoryPeers(
          participantData.year,
          participantData.category,
          participantData.id,
        ),
        findTavilyDataForPage(toTavilyCacheKey(displayName)),
        getCommonYearData(participantData.year),
      ]);

    return {
      locale,
      type,
      participant: participantData,
      member: memberData,
      displayName,
      year: participantData.year,
      categoryId: participantData.category,
      categoryName: participantData.categoryInfo.name,
      participantId: participantData.id,
      isCancelled: participantData.isCancelled,
      ticketClass: participantData.ticketClass,
      pastParticipation,
      pastYearParticipation: computePastYearParticipation(
        pastParticipation,
        participantData.year,
      ),
      sameYearCategoryPeers,
      tavily: buildProcessedBeatboxerSearch(tavilyRow, locale, displayName),
      common,
    };
  }

  const participantData = detailResult.data;
  const displayName = participantData.name;

  if (isUnknownParticipantName(displayName)) {
    throw new Error(`Participant name is unknown: id=${id}`);
  }

  const [pastParticipation, sameYearCategoryPeers, tavilyRow, common] =
    await Promise.all([
      findPastParticipation(displayName),
      findSameYearCategoryPeers(
        participantData.year,
        participantData.category,
        participantData.id,
      ),
      findTavilyDataForPage(toTavilyCacheKey(displayName)),
      getCommonYearData(participantData.year),
    ]);

  return {
    locale,
    type,
    participant: participantData,
    member: null,
    displayName,
    year: participantData.year,
    categoryId: participantData.category,
    categoryName: participantData.categoryInfo.name,
    participantId: participantData.id,
    isCancelled: participantData.isCancelled,
    ticketClass: participantData.ticketClass,
    pastParticipation,
    pastYearParticipation: computePastYearParticipation(
      pastParticipation,
      participantData.year,
    ),
    sameYearCategoryPeers,
    tavily: buildProcessedBeatboxerSearch(tavilyRow, locale, displayName),
    common,
  };
};

/**
 * 出場者詳細ページの getStaticPaths を生成する。
 *
 * Returns:
 *   Astro getStaticPaths 関数。
 *
 * Raises:
 *   Error: 本番ビルドでスナップショットが存在しない場合。
 */
export const getParticipantDetailStaticPaths = async () => {
  const store = loadBuildCache();
  if (!store) {
    const isDev =
      typeof import.meta !== "undefined" && import.meta.env?.DEV === true;
    if (!isDev) {
      throw new Error(
        "Build cache not found. Run npm run sync:build-cache before astro build.",
      );
    }

    const { findAllParticipantDetailPaths } = await import("~/db/participant.js");
    const paths = await findAllParticipantDetailPaths();
    return paths.flatMap(({ id, type }) =>
      locales
        .filter(isSupportedLanguage)
        .map((locale) => ({
          params: { lang: locale, type, id: String(id) },
        })),
    );
  }

  const paths = findAllParticipantDetailPathsFromStore(store);

  const pathEntries = await Promise.all(
    paths.flatMap(({ id, type }) =>
      locales
        .filter(isSupportedLanguage)
        .map(async (locale) => ({
          params: { lang: locale, type, id: String(id) },
          props: {
            pageData: await buildPageDataFromStore(
              store,
              locale,
              id,
              type,
            ),
          },
        })),
    ),
  );

  return pathEntries;
};

/**
 * SiteFrame に渡す共通 props を pageData から取り出す。
 *
 * Args:
 *   pageData: 詳細ページデータ。
 *
 * Returns:
 *   SiteFrame 用 props。
 */
export const participantDetailFrameProps = (
  pageData: ParticipantDetailPageData,
) => ({
  locale: pageData.locale,
  title: `GBB ${pageData.year} ${pageData.displayName} - GBBinfo`,
  subtitle: pageData.displayName,
  yearWithCountry: pageData.common.yearWithCountry,
  years: pageData.common.years,
  latestYearWithCountry: pageData.common.latestYearWithCountry,
});

const participantDetailCommonProps = (pageData: ParticipantDetailPageData) => ({
  locale: pageData.locale,
  displayName: pageData.displayName,
  year: pageData.year,
  categoryName: pageData.categoryName,
  isCancelled: pageData.isCancelled,
  ticketClass: pageData.ticketClass,
  pastParticipation: pageData.pastParticipation,
  pastYearParticipation: pageData.pastYearParticipation,
  sameYearCategoryPeers: pageData.sameYearCategoryPeers,
  tavily: pageData.tavily,
});

/**
 * ParticipantSingleDetailContent に渡す props を pageData から取り出す。
 *
 * Args:
 *   pageData: 詳細ページデータ。
 *
 * Returns:
 *   single 詳細用 props。
 *
 * Raises:
 *   Error: participant が存在しない場合。
 */
export const participantSingleDetailContentProps = (
  pageData: ParticipantDetailPageData,
) => {
  if (!pageData.participant) {
    throw new Error("Participant is required for single detail page");
  }
  return {
    ...participantDetailCommonProps(pageData),
    participant: pageData.participant,
  };
};

/**
 * ParticipantTeamDetailContent に渡す props を pageData から取り出す。
 *
 * Args:
 *   pageData: 詳細ページデータ。
 *
 * Returns:
 *   team 詳細用 props。
 *
 * Raises:
 *   Error: participant が存在しない場合。
 */
export const participantTeamDetailContentProps = (
  pageData: ParticipantDetailPageData,
) => {
  if (!pageData.participant) {
    throw new Error("Participant is required for team detail page");
  }
  return {
    ...participantDetailCommonProps(pageData),
    participant: pageData.participant,
  };
};

/**
 * ParticipantMemberDetailContent に渡す props を pageData から取り出す。
 *
 * Args:
 *   pageData: 詳細ページデータ。
 *
 * Returns:
 *   member 詳細用 props。
 *
 * Raises:
 *   Error: participant または member が存在しない場合。
 */
export const participantMemberDetailContentProps = (
  pageData: ParticipantDetailPageData,
) => {
  if (!pageData.participant || !pageData.member) {
    throw new Error("Participant and member are required for member detail page");
  }
  return {
    ...participantDetailCommonProps(pageData),
    participant: pageData.participant,
    member: pageData.member,
  };
};
