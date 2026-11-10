import { useEffect, useState } from "react";

/**
 * Gerbang kapabilitas perangkat bersama untuk efek visual non-esensial:
 * aktif hanya di layar >= 640 px, hardwareConcurrency > 4 (atau tak tersedia),
 * dan prefers-reduced-motion tidak aktif.
 */
function isVisualEffectsCapable() {
  if (typeof window === "undefined") return false;

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile = window.innerWidth < 640;

  const isLowPower =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  return !reducedMotion && !isMobile && !isLowPower;
}

export default function useVisualEffectsEnabled() {
  const [enabled, setEnabled] = useState(isVisualEffectsCapable);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => setEnabled(isVisualEffectsCapable());
    window.addEventListener("resize", sync);
    const mq =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    mq?.addEventListener?.("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      mq?.removeEventListener?.("change", sync);
    };
  }, []);

  return enabled;
}
