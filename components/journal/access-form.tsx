"use client";

import { useActionState, useState } from "react";
import { submitJournalAccess } from "@/app/journal/access/actions";

export function JournalAccessForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState(submitJournalAccess, {});
  const [showPassword, setShowPassword] = useState(false);
  const registering = mode === "register";
  const passwordType = showPassword ? "text" : "password";

  return (
    <form action={action} className="mt-6 grid gap-3" aria-busy={pending}>
      <input type="hidden" name="mode" value={mode} />
      <label htmlFor="journal-email" className="font-bold">
        Correo electrónico
      </label>
      <input
        id="journal-email"
        name="email"
        className="journal-access-input"
        type="email"
        autoComplete="username"
        spellCheck={false}
        maxLength={254}
        required
        defaultValue={state.email}
        aria-invalid={state.field === "email" || undefined}
        aria-describedby={state.field === "email" ? "journal-access-error" : undefined}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <label htmlFor="journal-password" className="font-bold">
          Contraseña
        </label>
        <button
          type="button"
          className="journal-access-link text-sm"
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        </button>
      </div>
      {registering && (
        <p id="journal-password-hint" className="text-paper-muted -mt-2 text-sm">
          Usa al menos 8 caracteres.
        </p>
      )}
      <input
        id="journal-password"
        name="password"
        className="journal-access-input"
        type={passwordType}
        autoComplete={registering ? "new-password" : "current-password"}
        minLength={registering ? 8 : undefined}
        maxLength={registering ? 72 : 1024}
        autoCapitalize="none"
        spellCheck={false}
        required
        aria-invalid={state.field === "password" || undefined}
        aria-describedby={
          [registering && "journal-password-hint", state.field === "password" && "journal-access-error"]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {registering && (
        <>
          <label htmlFor="journal-confirmation" className="font-bold">
            Repite la contraseña
          </label>
          <input
            id="journal-confirmation"
            name="confirmation"
            className="journal-access-input"
            type={passwordType}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-invalid={state.field === "confirmation" || undefined}
            aria-describedby={state.field === "confirmation" ? "journal-access-error" : undefined}
          />
        </>
      )}
      <p id="journal-access-error" role="alert" className="journal-access-error">
        {state.message}
      </p>
      <button className="action journal-hero-primary journal-access-submit" disabled={pending}>
        {pending
          ? registering
            ? "Creando cuenta…"
            : "Iniciando sesión…"
          : registering
            ? "Crear cuenta"
            : "Iniciar sesión"}
      </button>
    </form>
  );
}
