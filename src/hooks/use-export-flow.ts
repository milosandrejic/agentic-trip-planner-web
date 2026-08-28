"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

export type ExportStatus = "error" | "idle" | "preparing" | "ready";

export interface ExportFlow {
  fail: () => void;
  progress: number;
  reset: () => void;
  start: () => void;
  status: ExportStatus;
}

const PROGRESS_TICK_MS = 90;
const PROGRESS_STEP = 4;
const PROGRESS_COMPLETE = 100;

/**
 * Drives the export dialog's screens. There is no export endpoint yet (see
 * *Deferred / future* in the plan), so progress is simulated purely to exercise the UX.
 *
 * `fail()` moves the flow to its error screen; it exists so wiring a real request later
 * is a drop-in change rather than a redesign of this state machine.
 */
export function useExportFlow(): ExportFlow {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [progress, setProgress] = useState(0);

  const start = useCallback(() => {
    setProgress(0);
    setStatus("preparing");
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setStatus("idle");
  }, []);

  const fail = useCallback(() => setStatus("error"), []);

  useEffect(() => {
    if (status !== "preparing") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + PROGRESS_STEP;

        if (next >= PROGRESS_COMPLETE) {
          window.clearInterval(timer);
          setStatus("ready");

          return PROGRESS_COMPLETE;
        }

        return next;
      });
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(timer);
  }, [status]);

  return {
    fail,
    progress,
    reset,
    start,
    status,
  };
}
