import type { Challenge, Mode } from "./challenges";
import { challenges } from "./fixtures";
import { readCatalog } from "./supabase/catalog";

function isSupabaseCatalogEnabled() {
  return process.env.CHALLENGES_DATA_SOURCE === "supabase";
}

export async function listChallenges(mode?: Mode): Promise<Challenge[]> {
  if (isSupabaseCatalogEnabled()) return readCatalog({ mode });
  return challenges.filter((challenge) => !mode || challenge.mode === mode);
}

export async function getWeeklyChallenge(): Promise<Challenge | undefined> {
  if (isSupabaseCatalogEnabled()) return (await readCatalog({ weekly: true }))[0];
  return challenges.find((challenge) => challenge.weekly);
}

export async function getChallenge(slug: string): Promise<Challenge | undefined> {
  if (isSupabaseCatalogEnabled()) return (await readCatalog({ slug }))[0];
  return challenges.find((challenge) => challenge.slug === slug);
}
