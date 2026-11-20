"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export function ShareChallenge({ title }: { title: string }) {
  const [notice, setNotice] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function share() {
    const url = window.location.href;
    setNotice("");
    setManualUrl("");

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setNotice("Enlace copiado.");
    } catch {
      setManualUrl(url);
      setNotice("Puedes copiar el enlace manualmente.");
    }
  }

  return (
    <div className="min-w-0">
      <button type="button" onClick={share} className="action bg-vice text-night hover:shadow-glow-vice cursor-pointer">
        <Share2 aria-hidden="true" className="size-5" /> Compartir reto
      </button>
      <p role="status" className={notice ? "text-ink-muted mt-2 text-sm" : "sr-only"}>
        {notice}
      </p>
      {manualUrl && (
        <label className="mt-2 block text-sm">
          Enlace del reto
          <input
            className="border-line bg-surface mt-1 min-h-11 w-full rounded-sm border px-3"
            readOnly
            value={manualUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
