import { getNotebookAccount, notebookBucket, notebookPhotoId } from "@/lib/supabase/notebook";

const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(_request: Request, context: RouteContext<"/journal/media/[id]">) {
  const { id } = await context.params;
  const photo = notebookPhotoId.safeParse(id);
  if (!photo.success) return new Response(null, { status: 404, headers });

  const account = await getNotebookAccount(true);
  if (!account) return new Response(null, { status: 404, headers });

  const { data } = await account.client.storage.from(notebookBucket).download(`${account.owner}/${photo.data}`);
  if (!data || !["image/webp", "image/png"].includes(data.type)) return new Response(null, { status: 404, headers });
  return new Response(data, { headers: { ...headers, "Content-Type": data.type } });
}
