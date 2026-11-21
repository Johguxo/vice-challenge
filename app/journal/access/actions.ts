"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createJournalAuth } from "@/lib/supabase/auth";

const emailAddress = z.string().trim().max(254).pipe(z.email());
const accessMode = z.enum(["login", "register"]);
const loginPassword = z.string().min(1).max(1024);
const newPassword = z
  .string()
  .min(8)
  .refine((value) => new TextEncoder().encode(value).length <= 72);

type AccessState = {
  email?: string;
  message?: string;
  field?: "email" | "password" | "confirmation";
};

export async function submitJournalAccess(_previous: AccessState, form: FormData): Promise<AccessState> {
  const mode = accessMode.safeParse(form.get("mode"));
  const email = emailAddress.safeParse(form.get("email"));
  if (!mode.success || !email.success) return { field: "email", message: "Escribe un correo electrónico válido." };

  const registering = mode.data === "register";
  const password = (registering ? newPassword : loginPassword).safeParse(form.get("password"));
  if (!password.success) {
    return {
      email: email.data,
      field: "password",
      message: registering
        ? "Usa una contraseña de al menos 8 caracteres y un máximo de 72 bytes."
        : "Escribe tu contraseña.",
    };
  }
  if (registering && form.get("confirmation") !== password.data) {
    return { email: email.data, field: "confirmation", message: "Las contraseñas no coinciden." };
  }

  const client = await createJournalAuth();
  if (!client) return { email: email.data, message: "El acceso no está configurado en este sitio." };

  const credentials = { email: email.data, password: password.data };
  const { data, error } = registering
    ? await client.auth.signUp(credentials)
    : await client.auth.signInWithPassword(credentials);

  if (error) {
    if (error.status === 429) return { email: email.data, message: "Espera un momento antes de volver a intentarlo." };
    if (error.code === "email_not_confirmed")
      return { email: email.data, message: "Supabase todavía solicita confirmar este correo antes de iniciar sesión." };
    if (error.code === "weak_password")
      return { email: email.data, field: "password", message: "Elige una contraseña más segura." };
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { email: email.data, message: "Si ya tienes una cuenta con ese correo, inicia sesión." };
    }
    if (!registering && error.code === "invalid_credentials") {
      return { email: email.data, message: "El correo o la contraseña son incorrectos." };
    }
    return { email: email.data, message: "El acceso no está disponible en este momento. Inténtalo más tarde." };
  }

  if (!data.session) {
    return {
      email: email.data,
      message: "Supabase todavía solicita confirmar el correo. El acceso inmediato aún no está activo.",
    };
  }

  redirect("/journal/write");
}

export async function signOutJournal() {
  const client = await createJournalAuth();
  if (client) {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new Error("Could not sign out of the journal.");
  }
  redirect("/journal");
}
