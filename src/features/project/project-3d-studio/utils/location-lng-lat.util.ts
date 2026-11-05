import type { LocationGeometry } from "../types/project-experience.types"

/**
 * Representative lng/lat for Point, LineString, or Polygon geometries.
 */
export function getLocationLngLat(
  geometry: LocationGeometry
): { lng: number; lat: number } | null {
  const coords = geometry.coordinates
  if (geometry.type === "Point" && Array.isArray(coords)) {
    const lng = Number(coords[0])
    const lat = Number(coords[1])
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return { lng, lat }
    }
    return null
  }
  if (geometry.type === "LineString" && Array.isArray(coords) && coords.length > 0) {
    const mid = coords[Math.floor(coords.length / 2)] as number[]
    const lng = Number(mid?.[0])
    const lat = Number(mid?.[1])
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return { lng, lat }
    }
    return null
  }
  if (geometry.type === "Polygon" && Array.isArray(coords) && coords.length > 0) {
    const ring = coords[0] as number[][]
    if (!Array.isArray(ring) || ring.length === 0) return null
    const mid = ring[Math.floor(ring.length / 2)]
    const lng = Number(mid?.[0])
    const lat = Number(mid?.[1])
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return { lng, lat }
    }
  }
  return null
}
