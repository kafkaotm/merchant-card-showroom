// Generic debounce: only the trailing call within `delayMs` of quiet fires.
// Deliberately no "flush pending call now" escape hatch (e.g. on unmount) —
// that's a real gap (a pending write is lost if the page closes mid-delay),
// accepted for this scope and documented in docs/architecture.md rather
// than built.
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delayMs);
  };
}
