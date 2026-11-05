import type { ProjectLatLng } from "../types/project-experience.types"

/** True when project has usable map coordinates (0,0 treated as unset). */
export function hasValidProjectCoords(
  lat: number | null | undefined,
  lng: number | null | undefined
): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
  if (lat === 0 && lng === 0) return false
  return true
}

export function toProjectLatLng(
  lat: number | null | undefined,
  lng: number | null | undefined
): ProjectLatLng | null {
  if (!hasValidProjectCoords(lat, lng)) return null
  return { lat: lat as number, lng: lng as number }
}
