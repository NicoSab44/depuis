import { useEffect, useState } from "react";

/**
 * Returns the current timestamp, refreshed every 60 seconds.
 * All consumers share a single module-level interval — no per-component timers.
 */

type Listener = (now: number) => void;
const listeners = new Set<Listener>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function startGlobalTick() {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    const now = Date.now();
    listeners.forEach((fn) => fn(now));
  }, 60_000);
}

function stopGlobalTick() {
  if (listeners.size === 0 && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const listener: Listener = (ts) => setNow(ts);
    listeners.add(listener);
    startGlobalTick();
    return () => {
      listeners.delete(listener);
      stopGlobalTick();
    };
  }, []);

  return now;
}
