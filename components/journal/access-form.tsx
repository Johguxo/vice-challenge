"use client";

import { useActionState } from "react";
import { submitJournalAccess } from "@/app/journal/access/actions";

export function JournalAccessForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState(submitJournalAccess, {});

  return (
    <form action={action} className="mt-6 grid gap-3" aria-busy={pending}>
      <input type="hidden" name="mode" value={mode} />
      {state.email ? (
        <>
          <p role="status" className="text-paper-muted leading-relaxed">
            Si el correo puede recibir un código, lo enviamos a <strong className="wrap-anywhere">{state.email}</strong>
            .
          </p>
          <label htmlFor="journal-code" className="font-bold">
            Código de acceso
          </label>
          <input
            id="journal-code"
            name="code"
            className="journal-access-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,8}"
            maxLength={8}
            required
            aria-describedby={state.message ? "journal-access-error" : undefined}
          />
          <button
            className="action journal-hero-primary journal-access-submit"
            name="intent"
            value="verify"
            disabled={pending}
          >
            {pending ? "Verificando…" : "Verificar código"}
          </button>
          <button
            className="journal-access-link justify-self-start"
            name="intent"
            value="change-email"
            formNoValidate
            disabled={pending}
          >
            Usar otro correo o pedir un código nuevo
          </button>
        </>
      ) : (
        <>
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
            aria-describedby={state.message ? "journal-access-error" : undefined}
          />
          <button className="action journal-hero-primary journal-access-submit" disabled={pending}>
            {pending ? "Enviando…" : "Enviar código"}
          </button>
        </>
      )}
      <p id="journal-access-error" role="alert" className="journal-access-error">
        {state.message}
      </p>
    </form>
  );
}
