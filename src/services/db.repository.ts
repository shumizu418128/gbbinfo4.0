import type { Participant, TournamentResult, WorldMapPoint } from "../types";

interface SearchArgs {
  year: number;
  query: string;
}

const mockParticipants: Participant[] = [
  { id: 1, name: "RIVER'", country: "JP", crew: "NME", category: "Solo" },
  { id: 2, name: "WING", country: "KR", crew: "Beatpella", category: "Solo" },
  { id: 3, name: "ROFU", country: "JP", crew: "Rofu", category: "Showcase" },
];

const mockResults: TournamentResult[] = [
  { year: 2025, category: "Solo", champion: "WING", runnerUp: "RIVER'" },
  { year: 2025, category: "Tag Team", champion: "ROFU", runnerUp: "JAIRO" },
];

const mockWorldMap: WorldMapPoint[] = [
  { id: 1, lat: 35.6762, lng: 139.6503, title: "Tokyo", url: "https://example.com/tokyo" },
  { id: 2, lat: 37.5665, lng: 126.978, title: "Seoul", url: "https://example.com/seoul" },
  { id: 3, lat: 48.8566, lng: 2.3522, title: "Paris", url: "https://example.com/paris" },
];

export async function getParticipants(_year: number): Promise<Participant[]> {
  return mockParticipants;
}

export async function getTournamentResults(year: number): Promise<TournamentResult[]> {
  return mockResults.filter((item) => item.year <= year);
}

export async function getParticipantDetail(participantId: number): Promise<Participant | null> {
  return mockParticipants.find((item) => item.id === participantId) ?? null;
}

export async function getWorldMapPoints(year: number): Promise<WorldMapPoint[]> {
  // Placeholder for Hyperdrive SQL:
  // SELECT id, lat, lng, title, url FROM world_map_points WHERE year = $1 LIMIT 300;
  if (year < 2020) return [];
  return mockWorldMap;
}

export async function searchSite({ query, year }: SearchArgs): Promise<string> {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return `/ja/${year}/top`;
  if (normalized.includes("RULE")) return `/ja/${year}/rule`;
  if (normalized.includes("RESULT")) return `/ja/${year}/result`;
  return `/ja/${year}/participants?scroll=search_participants`;
}

export async function searchParticipants({ query }: SearchArgs): Promise<Participant[]> {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return mockParticipants;
  return mockParticipants.filter((item) => item.name.toUpperCase().includes(normalized));
}

export async function searchSuggestions(query: string): Promise<string[]> {
  const dictionary = ["schedule", "ticket", "rule", "participants", "result", "world map"];
  const normalized = query.trim().toLowerCase();
  return dictionary.filter((word) => word.includes(normalized)).slice(0, 6);
}
