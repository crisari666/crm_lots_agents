import type {
  ExperienceResourceType,
  ProjectLocationType
} from "../types/project-experience.types"
import { resolveExperienceAssetUrl } from "./experience-asset-url.util"

function readModelRotation(
  rotation: readonly number[] | undefined
): [number, number, number] {
  return [
    Number(rotation?.[0]) || 0,
    Number(rotation?.[1]) || 0,
    Number(rotation?.[2]) || 0
  ]
}

export type LinkedResourceModel = {
  id: string
  name: string
  url: string
  longitude: number
  latitude: number
  altitude: number
  rotation: [number, number, number]
}

export type LocationLinkDraft = {
  locationId: string
  linkedResourceId: string
  longitude: number
  latitude: number
  modelAltitude: number
  modelRotation: [number, number, number]
}

/**
 * Shows the library file on the coordinates currently in the place form.
 * The saved place stays unchanged until Save.
 */
export function applyLinkedResourceDraft(
  locations: readonly ProjectLocationType[],
  draft: LocationLinkDraft | null
): readonly ProjectLocationType[] {
  if (!draft) return locations
  return locations.map((location) => {
    if (location._id !== draft.locationId) return location
    const nextLocation: ProjectLocationType = {
      ...location,
      linkedResourceId: draft.linkedResourceId,
      linkedAssetId: "",
      modelAltitude: Number(draft.modelAltitude) || 0,
      modelRotation: readModelRotation(draft.modelRotation)
    }
    if (location.geometry.type !== "Point") return nextLocation
    if (!Number.isFinite(draft.longitude) || !Number.isFinite(draft.latitude)) {
      return nextLocation
    }
    return {
      ...nextLocation,
      geometry: {
        type: "Point",
        coordinates: [draft.longitude, draft.latitude]
      }
    }
  })
}

/**
 * Places a library GLB on the place point. The resource itself has no coordinates.
 */
export function buildLinkedResourceModels(
  locations: readonly ProjectLocationType[],
  resources: readonly ExperienceResourceType[]
): LinkedResourceModel[] {
  const resourcesById = new Map(resources.map((resource) => [resource._id, resource]))
  const models: LinkedResourceModel[] = []
  for (const location of locations) {
    if (location.isVisible === false) continue
    const resourceId = location.linkedResourceId?.trim() ?? ""
    if (!resourceId || location.geometry.type !== "Point") continue
    const resource = resourcesById.get(resourceId)
    if (!resource || resource.type !== "model_3d") continue
    if (!Array.isArray(location.geometry.coordinates)) continue
    const pair = location.geometry.coordinates as number[]
    const longitude = Number(pair[0])
    const latitude = Number(pair[1])
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) continue
    const url = resolveExperienceAssetUrl(resource)
    if (!url) continue
    models.push({
      id: `linked-resource-${location._id}`,
      name: resource.name,
      url,
      longitude,
      latitude,
      altitude: Number(location.modelAltitude) || 0,
      rotation: readModelRotation(location.modelRotation)
    })
  }
  return models
}
