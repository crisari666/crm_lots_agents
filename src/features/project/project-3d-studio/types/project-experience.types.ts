export type ProjectLocationCategory =
  | "hospital"
  | "education"
  | "shopping"
  | "tourism"
  | "nature"
  | "transport"
  | "road"
  | "town"
  | "services"
  | "other"

export type ProjectLocationSource = "mapbox" | "osm" | "manual" | "official"

export type ProjectLocationImportance =
  | "low"
  | "medium"
  | "high"
  | "featured"

export type ProjectLocationGeometryType = "Point" | "LineString" | "Polygon"

export type AmenityCategoryType = {
  key: string
  label: string
  sortOrder: number
  color?: string
}

export type ProjectExperienceStatus = "draft" | "published" | "disabled"

export type ProjectExperienceAssetType =
  | "image"
  | "video"
  | "panorama"
  | "model_3d"
  | "geojson"

export type StudioPanel =
  | "locations"
  | "map"
  | "assets"
  | "scenes"
  | "publish"

export type StudioTool =
  | "select"
  | "point"
  | "line"
  | "polygon"
  | "placeAsset"
  | "setProjectPin"
  | "pickAssetPosition"
  | "relocateLocation"

export type ProjectLatLng = {
  lat: number
  lng: number
}

export type StudioSelection =
  | { kind: "location"; id: string }
  | { kind: "asset"; id: string }
  | { kind: "scene"; id: string }
  | null

export type LocationGeometry = {
  type: ProjectLocationGeometryType
  coordinates: unknown
}

export type ProjectLocationType = {
  _id: string
  projectId: string
  name: string
  description: string
  subtitle: string
  category: ProjectLocationCategory
  categoryKey: string
  panoramaAssetId: string
  geometry: LocationGeometry
  source: ProjectLocationSource
  sourceId: string
  importance: ProjectLocationImportance
  media: {
    cover: string
    gallery: string[]
    video: string
  }
  distanceMeters: number | null
  roadDistanceMeters: number | null
  estimatedTravelMinutes: number | null
  isVisible: boolean
  isVerified: boolean
  verifiedAt: string | null
  verifiedByUserId: string
  sortOrder: number
  attribution: string
}

export type ExperienceCamera = {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

export type ExperienceSceneType = {
  id: string
  title: string
  description: string
  camera: ExperienceCamera
  durationMs: number
  visibleLayers: string[]
  locationIds: string[]
  assetIds: string[]
  narrative: { title: string; text: string } | null
  sortOrder: number
}

export type ExperiencePoiSettingsType = {
  publicRadiusMeters: number
  publicCategories: ProjectLocationCategory[]
  liveMapboxEnabled: boolean
  minImportance: ProjectLocationImportance
}

export type ExperienceRoadsStyleType = {
  color: string
  width: number
  opacity: number
}

export const DEFAULT_ROADS_STYLE: ExperienceRoadsStyleType = {
  color: "#38bdf8",
  width: 3,
  opacity: 0.95
}

export type ProjectExperienceType = {
  _id: string
  projectId: string
  status: ProjectExperienceStatus
  version: number
  settings: {
    styleUrl: string
    defaultZoom: number
    pitch: number
    bearing: number
    centerLongitude: number | null
    centerLatitude: number | null
    terrainEnabled: boolean
    terrainExaggeration: number
    buildings3DEnabled: boolean
    satelliteEnabled: boolean
    fogEnabled: boolean
    roadsStyle?: ExperienceRoadsStyleType
  }
  layers: {
    lots: boolean
    roads: boolean
    locations: boolean
    assets: boolean
    models3D: boolean
  }
  poi?: ExperiencePoiSettingsType
  amenityCategories?: AmenityCategoryType[]
  scenes: ExperienceSceneType[]
  publishedAt: string | null
  publishedVersion: number | null
}

export type ExperienceResourceType = {
  _id: string
  projectId: string
  name: string
  type: ProjectExperienceAssetType
  fileName: string
  thumbnailFileName: string
  sizeBytes: number
  mimeType: string
}

export type ExperienceAssetType = {
  _id: string
  projectId: string
  resourceId?: string | null
  name: string
  type: ProjectExperienceAssetType
  fileName: string
  thumbnailFileName: string
  position: {
    longitude: number
    latitude: number
    altitude: number | null
  }
  transform: {
    rotation: number[]
    scale: number
  }
  visible: boolean
  sortOrder: number
  sizeBytes: number
  mimeType: string
}

export type PlaceAssetPayload = {
  resourceId: string
  name?: string
  longitude: number
  latitude: number
  altitude?: number | null
}

export type PoiDiscoveryCandidate = {
  sourceId: string
  name: string
  category: ProjectLocationCategory
  geometry: {
    type: "Point"
    coordinates: [number, number]
  }
  distanceMeters: number
  attribution: string
  osmTags: Record<string, string>
}

export type PoiDiscoveryProvider = "mapbox"

export type PoiDiscoveryWarning = string

export type PoiDiscoveryResponse = {
  provider: PoiDiscoveryProvider
  candidates: PoiDiscoveryCandidate[]
  warnings: PoiDiscoveryWarning[]
}

export type CreateLocationPayload = {
  name: string
  description?: string
  subtitle?: string
  category: ProjectLocationCategory
  geometry: LocationGeometry
  source?: ProjectLocationSource
  sourceId?: string
  importance?: ProjectLocationImportance
  estimatedTravelMinutes?: number
  isVisible?: boolean
  sortOrder?: number
  attribution?: string
}

export type UpdateLocationPayload = Partial<{
  name: string
  description: string
  subtitle: string
  category: ProjectLocationCategory
  categoryKey: string
  panoramaAssetId: string
  gallery: string[]
  geometry: LocationGeometry
  importance: ProjectLocationImportance
  estimatedTravelMinutes: number
  roadDistanceMeters: number
  isVisible: boolean
  sortOrder: number
}>

export type UpdateExperiencePayload = {
  settings?: Partial<ProjectExperienceType["settings"]>
  layers?: Partial<ProjectExperienceType["layers"]>
  poi?: Partial<ExperiencePoiSettingsType>
  amenityCategories?: AmenityCategoryType[]
}

export type UpdateAssetPayload = Partial<{
  name: string
  position: Partial<ExperienceAssetType["position"]>
  transform: Partial<ExperienceAssetType["transform"]>
  visible: boolean
  sortOrder: number
}>

export const LOCATION_CATEGORIES: ProjectLocationCategory[] = [
  "hospital",
  "education",
  "shopping",
  "tourism",
  "nature",
  "transport",
  "road",
  "town",
  "services",
  "other"
]
