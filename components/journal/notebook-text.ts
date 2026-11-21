// The mirror holds the same font, wrapping and line height as the visible sheet.
export function paginateNotebookText(textarea: HTMLTextAreaElement, text: string): string[] {
  if (textarea.scrollHeight <= textarea.clientHeight) return [text];

  const mirror = textarea.cloneNode(false) as HTMLTextAreaElement;
  mirror.removeAttribute("id");
  mirror.setAttribute("aria-hidden", "true");
  mirror.tabIndex = -1;
  Object.assign(mirror.style, {
    position: "absolute",
    width: `${textarea.getBoundingClientRect().width}px`,
    height: `${textarea.clientHeight}px`,
    visibility: "hidden",
    pointerEvents: "none",
  });
  textarea.parentElement!.append(mirror);

  const pages: string[] = [];
  function fits(candidate: string) {
    mirror.value = candidate;
    return mirror.scrollHeight <= mirror.clientHeight;
  }

  try {
    let remaining = text;
    while (!fits(remaining)) {
      let low = 1;
      let high = remaining.length - 1;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (fits(remaining.slice(0, middle))) low = middle;
        else high = middle - 1;
      }
      // Keep a word together when the page can end at a nearby boundary.
      let cut = low;
      if (remaining[cut] === "\n") {
        cut++;
      } else if (/\S/.test(remaining[cut - 1]) && /\S/.test(remaining[cut])) {
        const boundary = remaining.slice(0, cut).search(/\s\S*$/);
        if (boundary >= 0 && boundary >= cut - 28) cut = boundary + 1;
      }
      // Do not split a Unicode surrogate pair between pages.
      if (/[\uD800-\uDBFF]/.test(remaining[cut - 1]) && cut > 1) cut--;
      pages.push(remaining.slice(0, cut));
      remaining = remaining.slice(cut);
    }
    pages.push(remaining);
    return pages;
  } finally {
    mirror.remove();
  }
}
