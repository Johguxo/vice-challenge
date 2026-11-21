"use server";

import { z } from "zod";
import {
  getNotebookAccount,
  maxNotebookPhotoBytes,
  notebookBucket,
  notebookPhotoId,
  notebookSnapshot,
} from "@/lib/supabase/notebook";

export async function savePrivateNotebook(expectedOwner: unknown, revision: unknown, snapshot: unknown) {
  const parsed = notebookSnapshot.safeParse(snapshot);
  const version = z.number().int().min(0).max(2147483646).safeParse(revision);
  if (!parsed.success || !version.success || Buffer.byteLength(JSON.stringify(parsed.data)) > 390000) {
    return { error: "limit" } as const;
  }
  const account = await getNotebookAccount(true);
  if (!account || account.owner !== expectedOwner) return { error: "session" } as const;

  const next = version.data + 1;
  const table = account.client.from("journal_notebooks");
  const { data, error } =
    version.data === 0
      ? await table
          .insert({ user_id: account.owner, snapshot: parsed.data, revision: next })
          .select("revision")
          .single()
      : await table
          .update({ snapshot: parsed.data, revision: next })
          .eq("user_id", account.owner)
          .eq("revision", version.data)
          .select("revision")
          .maybeSingle();

  if (error?.code === "23505" || (!error && !data)) return { error: "conflict" } as const;
  if (error) return { error: "network" } as const;
  return { revision: next } as const;
}

export async function uploadNotebookPhoto(expectedOwner: unknown, id: unknown, form: FormData) {
  const photo = form.get("photo");
  const photoId = notebookPhotoId.safeParse(id);
  if (!photoId.success || !(photo instanceof File) || photo.size > maxNotebookPhotoBytes || photo.size < 12) {
    return { ok: false } as const;
  }
  const header = Buffer.from(await photo.slice(0, 12).arrayBuffer());
  const png =
    photo.type === "image/png" && header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp =
    photo.type === "image/webp" &&
    header.toString("ascii", 0, 4) === "RIFF" &&
    header.toString("ascii", 8, 12) === "WEBP";
  if (!png && !webp) return { ok: false } as const;

  const account = await getNotebookAccount(true);
  if (!account || account.owner !== expectedOwner) return { ok: false } as const;
  const storage = account.client.storage.from(notebookBucket);
  const path = `${account.owner}/${photoId.data}`;
  const { error } = await storage.upload(path, photo, { contentType: photo.type, cacheControl: "0" });
  // Retrying a local import can reuse an upload that already finished.
  if (error) {
    const { data } = await storage.exists(path);
    if (!data) return { ok: false } as const;
  }
  return { ok: true, url: `/journal/media/${photoId.data}` } as const;
}
