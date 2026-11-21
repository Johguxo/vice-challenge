import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig } from "@/lib/supabase/auth";

export async function proxy(request: NextRequest) {
  const auth = getAuthConfig();
  let response = NextResponse.next({ request });
  if (!auth || !request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name))) return response;

  const client = createServerClient(auth.url, auth.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
      },
    },
  });
  await client.auth.getClaims();
  return response;
}

export const config = { matcher: ["/journal", "/journal/write", "/journal/access/:path*"] };
