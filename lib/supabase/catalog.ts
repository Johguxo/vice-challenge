import { createServerClient } from "@supabase/ssr";
import { cacheLife } from "next/cache";
import type { Challenge, Mode } from "../challenges";

type CatalogRow = {
  slug: string;
  title: string;
  description: string;
  rules: string[];
  mode: Mode;
  difficulty: Challenge["difficulty"];
  verification_level: Challenge["verification"];
  is_weekly: boolean;
  is_example: boolean;
  submissions: {
    claimed_time_ms: number;
    profiles: { username: string };
  }[];
};

type CatalogFilter = { mode?: Mode; slug?: string; weekly?: boolean };

export async function readCatalog({ mode, slug, weekly }: CatalogFilter = {}): Promise<Challenge[]> {
  "use cache";
  cacheLife("minutes");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("The Supabase catalog requires a project URL and publishable key.");
  }

  // Use the public role for shared cache entries, regardless of the visitor's session.
  const client = createServerClient(url, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  let query = client
    .from("challenges")
    .select(
      "slug,title,description,rules,mode,difficulty,verification_level,is_weekly,is_example,submissions(claimed_time_ms,profiles(username))",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id")
    .order("claimed_time_ms", { referencedTable: "submissions" })
    .order("id", { referencedTable: "submissions" });

  if (mode) query = query.eq("mode", mode);
  if (slug) query = query.eq("slug", slug).limit(1);
  if (weekly) query = query.eq("is_weekly", true).limit(1);

  const { data, error } = await query.overrideTypes<CatalogRow[], { merge: false }>();
  if (error) {
    throw new Error(`Unable to load the Supabase catalog (${error.code}).`);
  }

  return data.map((row) => {
    const bestTimes = new Map<string, number>();
    for (const { claimed_time_ms, profiles } of row.submissions) {
      if (!bestTimes.has(profiles.username)) {
        bestTimes.set(profiles.username, claimed_time_ms);
      }
    }

    return {
      slug: row.slug,
      title: row.title,
      objective: row.description,
      rules: row.rules,
      mode: row.mode,
      difficulty: row.difficulty,
      verification: row.verification_level,
      weekly: row.is_weekly,
      example: row.is_example,
      ranking: Array.from(bestTimes, ([username, timeMs]) => ({ username, timeMs })),
    };
  });
}
