"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Maximize2, Plus, Star, Sticker, StickyNote, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { NotebookPiece, stickers } from "./notebook-piece";
import {
  blankPage,
  openNotebook,
  prepareNotebookPhoto,
  readNotebook,
  saveNotebook,
  type NotebookPage,
  type NotebookPiece as Piece,
} from "./notebook-storage";
import { paginateNotebookText } from "./notebook-text";

export function Notebook() {
  const [pages, setPages] = useState<NotebookPage[]>([blankPage()]);
  const [pageIndex, setPageIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState("Abriendo tu libreta…");
  const [notice, setNotice] = useState("");
  const [stickerPicker, setStickerPicker] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [importing, setImporting] = useState(false);
  const database = useRef<IDBDatabase | null>(null);
  const fields = useRef(new Map<number, HTMLTextAreaElement>());
  const nextFocus = useRef<{ page: number; offset: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const activePage = pages[pageIndex] ?? blankPage();
  const favorites = pages.flatMap((page, index) => (page.favorite ? [index] : []));
  const spreadStart = pageIndex - (pageIndex % 2);

  useEffect(() => {
    let disposed = false;
    let opened: IDBDatabase | undefined;

    async function load() {
      try {
        opened = await openNotebook();
        if (disposed) return opened.close();
        const saved = await readNotebook(opened);
        if (disposed) return;
        database.current = opened;
        setPages(saved.pages);
        setPageIndex(saved.pageIndex);
      } catch {
        if (!disposed) setSaveState("El navegador no permite guardar esta libreta.");
      } finally {
        if (!disposed) setReady(true);
      }
    }

    void load();
    return () => {
      disposed = true;
      database.current = null;
      opened?.close();
    };
  }, []);

  useEffect(() => {
    const db = database.current;
    if (!ready || !db) return;
    let current = true;
    void saveNotebook(db, { pages, pageIndex }).then(
      () => {
        if (current) setSaveState("Guardado en este navegador");
      },
      () => {
        if (current) setSaveState("No se pudo guardar en este navegador.");
      },
    );
    return () => {
      current = false;
    };
  }, [pages, pageIndex, ready]);

  useEffect(() => {
    if (!expanded) return;
    const panel = dialog.current;
    if (panel && !panel.open) panel.showModal();
  }, [expanded]);

  useEffect(() => {
    const pending = nextFocus.current;
    if (!pending) return;
    const field = fields.current.get(pending.page);
    if (!field) return;
    field.focus();
    field.setSelectionRange(pending.offset, pending.offset);
    nextFocus.current = null;
  }, [pages, pageIndex, expanded]);

  function updatePage(index: number, update: (page: NotebookPage) => NotebookPage) {
    setPages((current) => {
      const next = [...current];
      next[index] = update(next[index] ?? blankPage());
      return next;
    });
  }

  function openPage(index: number) {
    if (index >= pages.length) updatePage(index, (page) => page);
    setPageIndex(index);
    setStickerPicker(false);
    setShowFavorites(false);
  }

  function write(index: number, input: HTMLTextAreaElement, composing = false) {
    const value = input.value;
    const chunks = composing ? [value] : paginateNotebookText(input, value);
    if (chunks.length === 1) {
      updatePage(index, (page) => ({ ...page, text: value }));
      return;
    }

    let offset = input.selectionEnd;
    let target = 0;
    while (target < chunks.length - 1 && offset > chunks[target].length) {
      offset -= chunks[target].length;
      target++;
    }
    if (target) {
      nextFocus.current = { page: index + target, offset };
      setPageIndex(index + target);
    }
    setPages((current) => [
      ...current.slice(0, index),
      { ...(current[index] ?? blankPage()), text: chunks[0] },
      ...chunks.slice(1).map((text) => ({ ...blankPage(), text })),
      ...current.slice(index + 1),
    ]);
    setNotice("El texto continúa en la página siguiente.");
  }

  function addPiece(index: number, kind: Piece["kind"], value = "") {
    const id = crypto.randomUUID();
    const start = { photo: { x: 0.92, y: 0.7 }, note: { x: 0.09, y: 0.7 }, sticker: { x: 0.82, y: 0.16 } }[kind];
    updatePage(index, (page) => ({
      ...page,
      pieces: [...page.pieces, { id, kind, value, ...start }],
    }));
    setStickerPicker(false);
  }

  async function importPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    const target = pageIndex;
    setImporting(true);
    try {
      addPiece(target, "photo", await prepareNotebookPhoto(file));
      setNotice("Foto añadida a la página.");
    } catch {
      setNotice("No se pudo importar. Elige una foto JPG, PNG o WebP de hasta 10 MB.");
    } finally {
      setImporting(false);
    }
  }

  function renderPage(index: number) {
    const page = pages[index] ?? blankPage();
    return (
      <div key={index} className="notebook-sheet" data-current={index === pageIndex}>
        <div className="notebook-page-number">
          <span>Página {index + 1}</span>
          {page.favorite && <Star aria-label="Favorita" size={17} fill="currentColor" />}
        </div>
        <div className="notebook-writing-area">
          <textarea
            ref={(field) => {
              if (field) fields.current.set(index, field);
              else fields.current.delete(index);
            }}
            className="notebook-lines"
            aria-label={`Escribe en la página ${index + 1}`}
            placeholder={index === 0 ? "Empieza por aquí…" : undefined}
            value={page.text}
            disabled={!ready}
            spellCheck={false}
            onFocus={() => {
              if (index >= pages.length) updatePage(index, (page) => page);
              setPageIndex(index);
            }}
            maxLength={20000}
            onChange={(event) => write(index, event.currentTarget, (event.nativeEvent as InputEvent).isComposing)}
            onCompositionEnd={(event) => write(index, event.currentTarget)}
          />
          {page.pieces.map((piece) => (
            <NotebookPiece
              key={piece.id}
              piece={piece}
              announce={setNotice}
              update={(change) =>
                updatePage(index, (item) => ({
                  ...item,
                  pieces: item.pieces.map((entry) => (entry.id === piece.id ? { ...entry, ...change } : entry)),
                }))
              }
              remove={() =>
                updatePage(index, (item) => ({
                  ...item,
                  pieces: item.pieces.filter((entry) => entry.id !== piece.id),
                }))
              }
            />
          ))}
        </div>
      </div>
    );
  }

  function toggleFavorite() {
    updatePage(pageIndex, (page) => ({ ...page, favorite: !page.favorite }));
    setNotice(activePage.favorite ? "Página quitada de favoritas." : "Página guardada en favoritas.");
  }

  function openImmersive(event: MouseEvent<HTMLButtonElement>) {
    // Some mobile browsers don't focus buttons on tap.
    event.currentTarget.focus();
    setExpanded(true);
  }

  function editor() {
    return (
      <div className="notebook-body">
        <div className="notebook-paper">
          <span className="notebook-ribbon" data-side={pageIndex % 2 === 0 ? "left" : "right"} aria-hidden="true" />
          <div className="notebook-spread" data-page={pageIndex + 1}>
            {renderPage(spreadStart)}
            {renderPage(spreadStart + 1)}
          </div>
          <div className="notebook-tools" role="group" aria-label="Herramientas de página">
            <div className="notebook-tools-group">
              <label className="sr-only" htmlFor="notebook-photo">
                Elige una foto para la libreta
              </label>
              <input
                ref={fileInput}
                id="notebook-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={importPhoto}
              />
              <button type="button" disabled={!ready || importing} onClick={() => fileInput.current?.click()}>
                <ImagePlus aria-hidden="true" size={19} /> {importing ? "Importando…" : "Foto"}
              </button>
              <button type="button" disabled={!ready} onClick={() => addPiece(pageIndex, "note")}>
                <StickyNote aria-hidden="true" size={19} /> Post-it
              </button>
              <button
                type="button"
                disabled={!ready}
                aria-expanded={stickerPicker}
                onClick={() => setStickerPicker((open) => !open)}
              >
                <Sticker aria-hidden="true" size={19} /> Sticker
              </button>
              <button type="button" disabled={!ready} aria-pressed={activePage.favorite} onClick={toggleFavorite}>
                <Star aria-hidden="true" size={19} fill={activePage.favorite ? "currentColor" : "none"} />
                {activePage.favorite ? "Quitar de favoritas" : "Guardar favorita"}
              </button>
            </div>
            <div className="notebook-tools-group notebook-pagination" role="group" aria-label="Páginas">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={pageIndex === 0}
                onClick={() => openPage(pageIndex - 1)}
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <span>Pág. {pageIndex + 1}</span>
              <button
                type="button"
                aria-label={pageIndex + 1 < pages.length ? "Página siguiente" : "Nueva página"}
                disabled={!ready}
                onClick={() => openPage(pageIndex + 1)}
              >
                {pageIndex + 1 < pages.length ? (
                  <ChevronRight aria-hidden="true" size={20} />
                ) : (
                  <Plus aria-hidden="true" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
        {stickerPicker && (
          <div className="notebook-picker" role="group" aria-label="Elige un sticker">
            {stickers.map(({ id, label, icon: Icon }) => (
              <button type="button" key={id} onClick={() => addPiece(pageIndex, "sticker", id)}>
                <Icon aria-hidden="true" size={21} /> {label}
              </button>
            ))}
          </div>
        )}
        <div className="notebook-meta">
          <p role="status">{saveState}</p>
          <button type="button" onClick={() => setShowFavorites((open) => !open)} aria-expanded={showFavorites}>
            <Star aria-hidden="true" size={16} /> Ver favoritas
          </button>
        </div>
        <p role="status" className={notice ? "notebook-notice" : "sr-only"}>
          {notice}
        </p>
        {showFavorites && (
          <div className="notebook-picker" role="group" aria-label="Páginas favoritas">
            {favorites.length ? (
              favorites.map((index) => (
                <button key={index} type="button" onClick={() => openPage(index)}>
                  Página {index + 1}
                </button>
              ))
            ) : (
              <p>Todavía no guardas páginas favoritas.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="notebook">
      <div className="notebook-heading">
        <div>
          <h1 className="notebook-title">
            GTA 6 <span>Journal</span>
          </h1>
          <p>Tu libreta se guarda en este navegador.</p>
        </div>
        <button className="action journal-hero-secondary" type="button" onClick={openImmersive}>
          <Maximize2 aria-hidden="true" size={18} /> Modo inmersivo
        </button>
      </div>
      {!expanded && editor()}
      <dialog
        ref={dialog}
        className="notebook-dialog"
        aria-labelledby="notebook-dialog-title"
        onClose={() => setExpanded(false)}
      >
        <div className="notebook-dialog-bar">
          <h2 id="notebook-dialog-title" className="notebook-title">
            GTA 6 <span>Journal</span>
          </h2>
          <form method="dialog">
            <button type="submit" className="action journal-hero-secondary">
              <X aria-hidden="true" size={18} /> Salir del modo inmersivo
            </button>
          </form>
        </div>
        {expanded && editor()}
      </dialog>
    </div>
  );
}
