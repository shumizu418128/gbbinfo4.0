import { locales } from "@paraglide/runtime.js";
import { isSupportedLanguage, type SupportedLanguage } from "~/constants/languageLabels.js";
import { isParticipantType, type ParticipantType } from "~/constants/participantType.js";
import {
  computePastYearParticipation,
  findAllParticipantDetailPaths,
  findParticipantDetail,
  findPastParticipation,
  findSameYearCategoryPeers,
  type ParticipantDetailMember,
  type ParticipantDetailParticipant,
  type ParticipantWithRelations,
  type PastParticipationEntry,
} from "~/db/participant.js";
import { findTavilyDataForPage } from "~/db/tavily.js";
import { getCommonYearData, type CommonYearData } from "~/util/staticPaths.js";
import {
  buildProcessedBeatboxerSearch,
  type ProcessedBeatboxerSearch,
} from "~/util/beatboxerSearchResults.js";
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
  pastParticipation: PastParticipationEntry[];
  pastYearParticipation: number[];
  sameYearCategoryPeers: ParticipantWithRelations[];
  tavily: ProcessedBeatboxerSearch;
  common: CommonYearData;
};

type ParticipantDetailPageParams = {
  lang?: string;
  type?: string;
  id?: string;
};

export type ParticipantDetailPageResolution =
  | { redirect: string }
  | { pageData: ParticipantDetailPageData };

/**
 * 出場者詳細ページ用のビルド時データをまとめて取得する。
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
  const detailResult = await findParticipantDetail(id, type);

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

  const [pastParticipation, sameYearCategoryPeers, tavilyRow, common] =
    await Promise.all([
      findPastParticipation(displayName),
      findSameYearCategoryPeers(year, categoryId, participantId),
      findTavilyDataForPage(toTavilyCacheKey(displayName)),
      getCommonYearData(year),
    ]);

  const pastYearParticipation = computePastYearParticipation(
    pastParticipation,
    year,
  );

  const tavily = buildProcessedBeatboxerSearch(tavilyRow, locale);

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
 * 出場者詳細ページの getStaticPaths を生成する。
 *
 * Returns:
 *   Astro getStaticPaths 関数。
 */
export const getParticipantDetailStaticPaths = async () => {
  const paths = await findAllParticipantDetailPaths();

  return paths.flatMap(({ id, type }) =>
    locales
      .filter(isSupportedLanguage)
      .map((locale) => ({
        params: { lang: locale, type, id: String(id) },
      })),
  );
};

/**
 * 出場者詳細ページの params を検証し、表示データまたは 404 リダイレクト先を返す。
 *
 * Args:
 *   params: Astro.params（lang, type, id）。
 *
 * Returns:
 *   pageData または redirect URL。
 */
export const resolveParticipantDetailPage = async (
  params: ParticipantDetailPageParams,
): Promise<ParticipantDetailPageResolution> => {
  const lang = params.lang ?? "";
  const typeParam = params.type ?? "";
  const idParam = params.id ?? "";

  if (!isSupportedLanguage(lang) || !isParticipantType(typeParam)) {
    return { redirect: `/${lang || "ja"}/404` };
  }

  const participantId = Number(idParam);
  if (!Number.isFinite(participantId)) {
    return { redirect: `/${lang}/404` };
  }

  try {
    const pageData = await loadParticipantDetailPageData(
      lang,
      participantId,
      typeParam,
    );
    return { pageData };
  } catch (error) {
    console.warn(
      `Participant detail not found: ${lang}/participant/${typeParam}/${participantId}`,
      error,
    );
    return { redirect: `/${lang}/404` };
  }
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
