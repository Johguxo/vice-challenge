import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export async function createJournalAuth({ writable = true } = {}) {
  const config = getAuthConfig();
  if (!config) return null;

  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        if (!writable) return;
        for (const { name, value, options } of values) store.set(name, value, options);
      },
    },
  });
}
