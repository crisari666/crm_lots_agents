import type { LocationLinkDraft } from "../utils/linked-resource-model.util"
import type {
  ExperienceAssetType,
  ExperienceResourceType,
  PoiDiscoveryCandidate,
  PoiDiscoveryProvider,
  PoiDiscoveryWarning,
  ProjectExperienceType,
  ProjectLatLng,
  ProjectLocationType,
  StudioPanel,
  StudioSelection,
  StudioTool
} from "../types/project-experience.types"

export type Project3dStudioState = {
  projectId: string | null
  projectLatLng: ProjectLatLng | null
  experience: ProjectExperienceType | null
  locations: ProjectLocationType[]
  assets: ExperienceAssetType[]
  resources: ExperienceResourceType[]
  discoverCandidates: PoiDiscoveryCandidate[]
  selectedDiscoverSourceIds: string[]
  livePreviewCandidates: PoiDiscoveryCandidate[]
  loading: boolean
  error: string | null
  actionLoading: boolean
  discoverLoading: boolean
  discoverProvider: PoiDiscoveryProvider | null
  discoverWarnings: PoiDiscoveryWarning[]
  discoverError: string | null
  activePanel: StudioPanel
  activeTool: StudioTool
  selection: StudioSelection
  previewMode: boolean
  dirty: boolean
  scenePlaying: boolean
  activeSceneId: string | null
  mapCamera: {
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
  } | null
  pendingAssetPosition: ProjectLatLng | null
  /** Asset id targeted by the placeAsset map tool (survives drawer close). */
  placingAssetId: string | null
  /** Location id targeted by the relocateLocation map tool. */
  relocatingLocationId: string | null
  /** Unsaved library pick drawn on the place until Save or close. */
  locationLinkDraft: LocationLinkDraft | null
  discoverRadiusMeters: number
}
