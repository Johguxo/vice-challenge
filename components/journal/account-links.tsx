import Link from "next/link";
import { signOutJournal } from "@/app/journal/access/actions";
import { createJournalAuth } from "@/lib/supabase/auth";

export function JournalGuestLinks() {
  return (
    <>
      <Link href="/journal/access/login" className="action journal-hero-secondary journal-account-action">
        Iniciar sesión
      </Link>
      <Link href="/journal/access/register" className="action journal-hero-primary journal-account-action">
        Registrarse
      </Link>
    </>
  );
}

export async function JournalAccountLinks() {
  const client = await createJournalAuth({ writable: false });
  if (!client) return <JournalGuestLinks />;
  const { data } = await client.auth.getClaims();

  return data?.claims.sub ? (
    <form action={signOutJournal}>
      <button type="submit" className="action journal-hero-secondary journal-account-action cursor-pointer">
        Cerrar sesión
      </button>
    </form>
  ) : (
    <JournalGuestLinks />
  );
}
