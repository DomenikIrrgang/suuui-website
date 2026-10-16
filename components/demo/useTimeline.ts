"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * A looping frame counter that ticks every 100 ms, like the design's clips.
 * With reduced motion it starts paused on `stillFrame`, the frame that tells the story best.
 */
export function useTimeline(length: number, stillFrame: number) {
  const [state, setState] = useState({ t: 0, paused: false, ready: false });

  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    setState(reduce ? { t: stillFrame, paused: true, ready: true } : (s) => ({ ...s, ready: true }));
  }, [stillFrame]);

  useEffect(() => {
    if (!state.ready || state.paused) return;
    const id = setInterval(() => setState((s) => ({ ...s, t: (s.t + 1) % length })), 100);
    return () => clearInterval(id);
  }, [state.ready, state.paused, length]);

  const toggle = useCallback(() => setState((s) => ({ ...s, paused: !s.paused })), []);
  /** Back to the first frame, unless paused (a paused clip keeps the frame it shows). */
  const restart = useCallback(() => setState((s) => (s.paused ? s : { ...s, t: 0 })), []);
  return { t: state.t, paused: state.paused, toggle, restart };
}
