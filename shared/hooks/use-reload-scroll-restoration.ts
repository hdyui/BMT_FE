"use client";

import { useEffect, useRef } from "react";

type ReloadScrollSnapshot<T> = {
  scrollY: number;
  state: T;
  pathname: string;
  savedAt: number;
};

const reloadSnapshotMaxAgeMs = 15_000;

type UseReloadScrollRestorationOptions<T> = {
  storageKey: string;
  ready: boolean;
  getState: () => T;
  restoreState: (state: T) => void;
};

export function useReloadScrollRestoration<T>({
  storageKey,
  ready,
  getState,
  restoreState,
}: UseReloadScrollRestorationOptions<T>) {
  const getStateRef = useRef(getState);
  const restoreStateRef = useRef(restoreState);
  const snapshotRef = useRef<ReloadScrollSnapshot<T> | null>(null);
  const shouldRestoreRef = useRef(false);
  const restoredRef = useRef(false);

  useEffect(() => {
    getStateRef.current = getState;
    restoreStateRef.current = restoreState;
  }, [getState, restoreState]);

  useEffect(() => {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    let navigationPathname = "";
    try {
      navigationPathname = navigation?.name
        ? new URL(navigation.name).pathname
        : "";
    } catch {
      navigationPathname = "";
    }
    const isReload =
      navigation?.type === "reload" &&
      navigationPathname === window.location.pathname;

    if (isReload) {
      try {
        const raw = window.sessionStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as ReloadScrollSnapshot<T>;
          const isValidSnapshot =
            typeof parsed.scrollY === "number" &&
            Number.isFinite(parsed.scrollY) &&
            typeof parsed.pathname === "string" &&
            parsed.pathname === window.location.pathname &&
            typeof parsed.savedAt === "number" &&
            Number.isFinite(parsed.savedAt) &&
            Date.now() - parsed.savedAt >= 0 &&
            Date.now() - parsed.savedAt <= reloadSnapshotMaxAgeMs;

          // A reload snapshot is single-use. Removing it here prevents a
          // later SPA navigation from reusing the same scroll position just
          // because the document itself originally came from a reload.
          window.sessionStorage.removeItem(storageKey);

          if (isValidSnapshot) {
            snapshotRef.current = parsed;
            shouldRestoreRef.current = true;
            window.history.scrollRestoration = "manual";
            restoreStateRef.current(parsed.state);
          }
        }
      } catch {
        snapshotRef.current = null;
      }
    }

    const saveSnapshot = () => {
      try {
        const snapshot: ReloadScrollSnapshot<T> = {
          scrollY: window.scrollY,
          state: getStateRef.current(),
          pathname: window.location.pathname,
          savedAt: Date.now(),
        };
        window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
      } catch {
        // Scroll restoration is best-effort only.
      }
    };

    window.addEventListener("pagehide", saveSnapshot);
    window.addEventListener("beforeunload", saveSnapshot);

    return () => {
      window.removeEventListener("pagehide", saveSnapshot);
      window.removeEventListener("beforeunload", saveSnapshot);
    };
  }, [storageKey]);

  useEffect(() => {
    if (
      !ready ||
      !shouldRestoreRef.current ||
      restoredRef.current ||
      !snapshotRef.current
    ) {
      return;
    }

    const targetY = Math.max(0, snapshotRef.current.scrollY);
    let attempt = 0;
    let timeoutId: number | null = null;
    let frameId = 0;

    const restore = () => {
      window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      attempt += 1;

      const reachedTarget = Math.abs(window.scrollY - targetY) <= 2;
      if (reachedTarget || attempt >= 12) {
        restoredRef.current = true;
        window.history.scrollRestoration = "auto";
        return;
      }

      timeoutId = window.setTimeout(restore, 60);
    };

    frameId = window.requestAnimationFrame(() => {
      frameId = window.requestAnimationFrame(restore);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [ready]);
}
