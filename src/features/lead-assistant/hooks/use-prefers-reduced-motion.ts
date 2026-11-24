import { useMediaQuery } from "@mui/material"

export const FADE_DURATION_MS = 180

/** True when the user asked the OS to minimise motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/** Fade duration that collapses to zero for reduced motion. */
export function useFadeDuration(): number {
  return usePrefersReducedMotion() ? 0 : FADE_DURATION_MS
}
