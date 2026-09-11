import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "../src/core/debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call the function before the delay elapses", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("a");
    vi.advanceTimersByTime(299);

    expect(fn).not.toHaveBeenCalled();
  });

  it("calls the function once, with only the latest args, after the delay elapses", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("a");
    debounced("b");
    debounced("c");
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith("c");
  });
});
