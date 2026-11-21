"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { savePrivateNotebook } from "@/app/journal/write/actions";
import type { NotebookSnapshot } from "./notebook-storage";

type SaveStatus = "saved" | "saving" | "network" | "conflict" | "limit" | "session";

export const notebookSaveMessages: Record<SaveStatus, string> = {
  saved: "Guardado en tu cuenta",
  saving: "Guardando…",
  network: "No se pudo guardar. Puedes volver a intentarlo.",
  conflict: "La libreta cambió en otro dispositivo. Copia estas ediciones antes de volver a abrirla.",
  limit: "La libreta superó el límite de guardado. Reduce el contenido antes de reintentar.",
  session: "Tu sesión terminó. Conserva este texto antes de volver a iniciar sesión.",
};

export function useNotebookSync(owner: string, initialRevision: number, snapshot: NotebookSnapshot) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const revision = useRef(initialRevision);
  const latest = useRef(snapshot);
  const saved = useRef(snapshot);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const conflicting = useRef(false);

  const flush = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) return inFlight.current;
    if (conflicting.current) return false;

    const task = async () => {
      while (latest.current !== saved.current) {
        const value = latest.current;
        setStatus("saving");
        try {
          const result = await savePrivateNotebook(owner, revision.current, value);
          if ("error" in result && result.error) {
            if (result.error === "conflict") conflicting.current = true;
            setStatus(result.error);
            return false;
          }
          revision.current = result.revision;
          saved.current = value;
        } catch {
          setStatus("network");
          return false;
        }
      }
      setStatus("saved");
      return true;
    };
    const pending = task();
    inFlight.current = pending;
    try {
      return await pending;
    } finally {
      inFlight.current = null;
    }
  }, [owner]);

  useEffect(() => {
    latest.current = snapshot;
    if (snapshot === saved.current) return;
    const timer = window.setTimeout(() => {
      void flush();
    }, 400);
    return () => clearTimeout(timer);
  }, [snapshot, flush]);

  useEffect(() => {
    function leave(event: BeforeUnloadEvent) {
      if (latest.current === saved.current) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, []);

  return { status, flush };
}
