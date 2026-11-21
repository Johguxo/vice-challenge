import { z } from "zod";
import { createJournalAuth } from "./auth";

export const notebookBucket = "journal-photos";
export const maxNotebookPhotoBytes = 786432;
export const notebookPhotoId = z.uuid();
const photoUrl = z.string().refine((value) => {
  const prefix = "/journal/media/";
  return value.startsWith(prefix) && notebookPhotoId.safeParse(value.slice(prefix.length)).success;
});

const position = { id: z.uuid(), x: z.number().min(0).max(1), y: z.number().min(0).max(1) };
const piece = z.discriminatedUnion("kind", [
  z.object({ ...position, kind: z.literal("note"), value: z.string().max(200) }),
  z.object({ ...position, kind: z.literal("sticker"), value: z.enum(["palm", "car", "shell"]) }),
  z.object({ ...position, kind: z.literal("photo"), value: photoUrl }),
]);

export const notebookSnapshot = z
  .object({
    pages: z
      .array(
        z.object({
          text: z.string().max(20000),
          favorite: z.boolean(),
          pieces: z.array(piece).max(60),
        }),
      )
      .min(1)
      .max(300),
    pageIndex: z.number().int().nonnegative(),
    importedLocal: z.boolean().default(false),
  })
  .refine(({ pages, pageIndex }) => pageIndex < pages.length);

export async function getNotebookAccount(writable: boolean) {
  const client = await createJournalAuth({ writable });
  if (!client) return null;
  const { data, error } = await client.auth.getClaims();
  const owner = !error ? notebookPhotoId.safeParse(data?.claims.sub) : null;
  return owner?.success ? { client, owner: owner.data } : null;
}

export async function readPrivateNotebook(account: NonNullable<Awaited<ReturnType<typeof getNotebookAccount>>>) {
  const { data, error } = await account.client
    .from("journal_notebooks")
    .select("snapshot,revision")
    .eq("user_id", account.owner)
    .maybeSingle();

  if (error) return { ok: false } as const;
  if (!data) return { ok: true, snapshot: null, revision: 0 } as const;

  const snapshot = notebookSnapshot.safeParse(data.snapshot);
  if (!snapshot.success || !Number.isInteger(data.revision)) return { ok: false } as const;
  return { ok: true, snapshot: snapshot.data, revision: data.revision as number } as const;
}
