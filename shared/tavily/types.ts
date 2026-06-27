export type AnswerTranslation = Record<string, string>;

export type LocalTavilyCacheEntry = {
  cacheKey: string;
  beatboxerName: string;
  searchResults: Record<string, unknown>;
  answerTranslation: AnswerTranslation;
  updatedAt: string;
};
