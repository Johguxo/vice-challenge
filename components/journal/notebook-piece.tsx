"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Car, GripHorizontal, Palmtree, Shell, X } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import type { NotebookPiece as Piece } from "./notebook-storage";

export const stickers = [
  { id: "palm", label: "Palmera", icon: Palmtree },
  { id: "car", label: "Auto clásico", icon: Car },
  { id: "shell", label: "Concha marina", icon: Shell },
] as const;

const directions = {
  ArrowUp: { x: 0, y: -1, name: "arriba", icon: ArrowUp },
  ArrowLeft: { x: -1, y: 0, name: "izquierda", icon: ArrowLeft },
  ArrowRight: { x: 1, y: 0, name: "derecha", icon: ArrowRight },
  ArrowDown: { x: 0, y: 1, name: "abajo", icon: ArrowDown },
} as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const position = (x: number, y: number) => ({ x: clamp(x), y: clamp(y) });

export function NotebookPiece({
  piece,
  update,
  remove,
  announce,
}: {
  piece: Piece;
  update: (change: Partial<Piece>) => void;
  remove: () => void;
  announce: (text: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; width: number; height: number; moved: boolean } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const [showMoves, setShowMoves] = useState(false);
  const visible = preview ?? piece;
  const sticker = stickers.find(({ id }) => id === piece.value) ?? stickers[0];
  const label = piece.kind === "photo" ? "Foto" : piece.kind === "note" ? "Post-it" : sticker.label;
  const Icon = sticker.icon;

  function move(x: number, y: number, name: string) {
    update(position(piece.x + x * 0.045, piece.y + y * 0.045));
    announce(`${label} se movió hacia ${name}.`);
  }

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !ref.current?.parentElement) return;
    const card = ref.current.getBoundingClientRect();
    const page = ref.current.parentElement.getBoundingClientRect();
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      width: Math.max(1, page.width - card.width),
      height: Math.max(1, page.height - card.height),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function coordinates(event: PointerEvent<HTMLButtonElement>) {
    const origin = drag.current;
    if (!origin) return null;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (!origin.moved && Math.hypot(dx, dy) < 4) return null;
    origin.moved = true;
    return position(piece.x + dx / origin.width, piece.y + dy / origin.height);
  }

  return (
    <div
      ref={ref}
      className="notebook-piece"
      data-kind={piece.kind}
      style={{
        left: `${visible.x * 100}%`,
        top: `${visible.y * 100}%`,
        translate: `${-visible.x * 100}% ${-visible.y * 100}%`,
      }}
    >
      <div className="notebook-piece-controls">
        <button
          type="button"
          className="notebook-drag-handle"
          aria-label={`Mover ${label}. Usa las flechas del teclado`}
          aria-expanded={showMoves}
          onPointerDown={start}
          onPointerMove={(event) => {
            const next = coordinates(event);
            if (next) setPreview(next);
          }}
          onPointerUp={(event) => {
            const next = coordinates(event);
            if (next) {
              update(next);
              announce(`${label} se movió.`);
            }
            setPreview(null);
            // The synthetic click following this pointerup should only open the panel after a tap.
          }}
          onLostPointerCapture={() => setPreview(null)}
          onPointerCancel={() => {
            drag.current = null;
            setPreview(null);
          }}
          onClick={() => {
            if (!drag.current?.moved) setShowMoves((open) => !open);
            drag.current = null;
          }}
          onKeyDown={(event) => {
            const direction = directions[event.key as keyof typeof directions];
            if (!direction) return;
            event.preventDefault();
            move(direction.x, direction.y, direction.name);
          }}
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        <button type="button" aria-label={`Quitar ${label}`} onClick={remove}>
          <X aria-hidden="true" size={16} />
        </button>
      </div>
      {showMoves && (
        <div className="notebook-move-buttons" aria-label={`Posición de ${label}`}>
          {Object.values(directions).map(({ x, y, name, icon: Arrow }) => (
            <button key={name} type="button" aria-label={`Mover hacia ${name}`} onClick={() => move(x, y, name)}>
              <Arrow aria-hidden="true" size={17} />
            </button>
          ))}
        </div>
      )}
      {piece.kind === "note" && (
        <textarea
          aria-label="Texto del post-it"
          placeholder="Escribe una nota…"
          maxLength={200}
          value={piece.value}
          onChange={(event) => update({ value: event.currentTarget.value })}
        />
      )}
      {piece.kind === "photo" && (
        // Data URL created from a local, validated image. It is never sent to the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={piece.value} alt="Foto pegada en el diario" width={148} height={100} draggable={false} />
      )}
      {piece.kind === "sticker" && <Icon aria-hidden="true" className="notebook-sticker-icon" strokeWidth={1.35} />}
    </div>
  );
}
