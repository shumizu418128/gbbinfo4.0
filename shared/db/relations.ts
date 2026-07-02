import { relations } from "drizzle-orm";
import {
  categoryTable,
  countryTable,
  participantMemberTable,
  participantTable,
  rankingResultTable,
  tavilyTable,
  tournamentResultTable,
  yearTable,
} from "./tables.js";

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  participants: many(participantTable),
  rankingResults: many(rankingResultTable),
  tournamentResults: many(tournamentResultTable),
}));

export const countryRelations = relations(countryTable, ({ many }) => ({
  years: many(yearTable),
  participants: many(participantTable),
  participantMembers: many(participantMemberTable),
}));

export const yearRelations = relations(yearTable, ({ one, many }) => ({
  country: one(countryTable, {
    fields: [yearTable.isoCode],
    references: [countryTable.isoCode],
  }),
  participants: many(participantTable),
  rankingResults: many(rankingResultTable),
  tournamentResults: many(tournamentResultTable),
}));

export const participantRelations = relations(participantTable, ({ one, many }) => ({
  yearInfo: one(yearTable, {
    fields: [participantTable.year],
    references: [yearTable.year],
  }),
  country: one(countryTable, {
    fields: [participantTable.isoCode],
    references: [countryTable.isoCode],
  }),
  categoryInfo: one(categoryTable, {
    fields: [participantTable.category],
    references: [categoryTable.id],
  }),
  members: many(participantMemberTable),
  rankingResults: many(rankingResultTable),
  wonTournaments: many(tournamentResultTable, { relationName: "winner" }),
  lostTournaments: many(tournamentResultTable, { relationName: "loser" }),
}));

export const participantMemberRelations = relations(
  participantMemberTable,
  ({ one }) => ({
    participantInfo: one(participantTable, {
      fields: [participantMemberTable.participant],
      references: [participantTable.id],
    }),
    country: one(countryTable, {
      fields: [participantMemberTable.isoCode],
      references: [countryTable.isoCode],
    }),
  }),
);

export const rankingResultRelations = relations(rankingResultTable, ({ one }) => ({
  yearInfo: one(yearTable, {
    fields: [rankingResultTable.year],
    references: [yearTable.year],
  }),
  categoryInfo: one(categoryTable, {
    fields: [rankingResultTable.category],
    references: [categoryTable.id],
  }),
  participantInfo: one(participantTable, {
    fields: [rankingResultTable.participant],
    references: [participantTable.id],
  }),
}));

export const tournamentResultRelations = relations(
  tournamentResultTable,
  ({ one }) => ({
    yearInfo: one(yearTable, {
      fields: [tournamentResultTable.year],
      references: [yearTable.year],
    }),
    categoryInfo: one(categoryTable, {
      fields: [tournamentResultTable.category],
      references: [categoryTable.id],
    }),
    winnerParticipant: one(participantTable, {
      fields: [tournamentResultTable.winner],
      references: [participantTable.id],
      relationName: "winner",
    }),
    loserParticipant: one(participantTable, {
      fields: [tournamentResultTable.loser],
      references: [participantTable.id],
      relationName: "loser",
    }),
  }),
);

export const schema = {
  categoryTable,
  countryTable,
  yearTable,
  participantTable,
  participantMemberTable,
  rankingResultTable,
  tournamentResultTable,
  tavilyTable,
  categoryRelations,
  countryRelations,
  yearRelations,
  participantRelations,
  participantMemberRelations,
  rankingResultRelations,
  tournamentResultRelations,
};

export type Schema = typeof schema;
