import type { Challenge, Mode } from "./challenges";
import { challenges } from "./fixtures";

export async function listChallenges(mode?: Mode): Promise<Challenge[]> {
  return challenges.filter((challenge) => !mode || challenge.mode === mode);
}

export async function getWeeklyChallenge(): Promise<Challenge | undefined> {
  return challenges.find((challenge) => challenge.weekly);
}

export async function getChallenge(slug: string): Promise<Challenge | undefined> {
  return challenges.find((challenge) => challenge.slug === slug);
}
