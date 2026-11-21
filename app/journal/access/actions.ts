"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createJournalAuth } from "@/lib/supabase/auth";

const emailAddress = z.string().trim().max(254).pipe(z.email());
const accessMode = z.enum(["login", "register"]);
const emailCode = z
  .string()
  .trim()
  .regex(/^\d{6,8}$/);

type AccessState = { email?: string; message?: string };

export async function submitJournalAccess(previous: AccessState, form: FormData): Promise<AccessState> {
  const intent = form.get("intent");
  if (intent === "change-email") return {};

  if (intent === "verify") {
    const email = emailAddress.safeParse(previous.email);
    const code = emailCode.safeParse(form.get("code"));
    if (!email.success) return { message: "Vuelve a escribir tu correo." };
    if (!code.success) return { email: email.data, message: "Escribe el código numérico que recibiste." };

    const client = await createJournalAuth();
    if (!client) return { email: email.data, message: "El acceso por correo no está disponible ahora." };

    const { error } = await client.auth.verifyOtp({ email: email.data, token: code.data, type: "email" });
    if (error) return { email: email.data, message: "El código no es válido o venció. Revísalo o solicita otro." };
    redirect("/journal#mi-diario");
  }

  const mode = accessMode.safeParse(form.get("mode"));
  const email = emailAddress.safeParse(form.get("email"));
  if (!mode.success || !email.success) return { message: "Escribe un correo electrónico válido." };

  const client = await createJournalAuth();
  if (!client) return { message: "El acceso por correo no está disponible ahora." };

  const { error } = await client.auth.signInWithOtp({
    email: email.data,
    options: { shouldCreateUser: mode.data === "register" },
  });

  if (
    error &&
    !(mode.data === "login" && ["user_not_found", "otp_disabled", "signup_disabled"].includes(error.code ?? ""))
  ) {
    const message =
      error.status === 429
        ? "Espera un momento antes de pedir otro código."
        : "No pudimos enviar el código. Revisa tu correo o inténtalo más tarde.";
    return { email: previous.email, message };
  }

  return { email: email.data };
}

export async function signOutJournal() {
  const client = await createJournalAuth();
  if (client) {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new Error("Could not sign out of the journal.");
  }
  redirect("/journal");
}
