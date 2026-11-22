import type { Category, Country, Judge } from "./tables.js";

/** 本戦か Wildcard か。 */
export type JudgePanel = "main" | "wildcard";

/** Country・Category 付き Judge。 */
export type JudgeWithRelations = Judge & {
  panel: JudgePanel;
  country: Country;
  categoryInfo: Category;
};
