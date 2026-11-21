export type NotebookPiece = {
  id: string;
  kind: "note" | "photo" | "sticker";
  value: string;
  x: number;
  y: number;
};

export type NotebookPage = {
  text: string;
  favorite: boolean;
  pieces: NotebookPiece[];
};

export function blankPage(): NotebookPage {
  return { text: "", favorite: false, pieces: [] };
}

export function openNotebook(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("gta-journal", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("notebooks");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function readNotebook(db: IDBDatabase): Promise<NotebookPage[]> {
  return new Promise((resolve, reject) => {
    const request = db.transaction("notebooks").objectStore("notebooks").get("personal");
    request.onsuccess = () => resolve(request.result?.length ? request.result : [blankPage()]);
    request.onerror = () => reject(request.error);
  });
}

export function saveNotebook(db: IDBDatabase, pages: NotebookPage[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notebooks", "readwrite");
    transaction.objectStore("notebooks").put(pages, "personal");
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function prepareNotebookPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error("Elige una imagen JPG, PNG o WebP de hasta 10 MB.");
  }

  const image = new Image();
  const url = URL.createObjectURL(file);
  try {
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la foto.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.8);
  } finally {
    URL.revokeObjectURL(url);
  }
}
