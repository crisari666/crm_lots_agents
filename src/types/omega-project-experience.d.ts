declare module "@omega/project-experience" {
  import type { ReactElement } from "react"

  export type PlaceRoute = {
    profile: "driving"
    distanceMeters: number
    durationSeconds: number
    geometry: {
      type: "LineString"
      coordinates: readonly (readonly number[])[]
    }
  }

  export type PublicAmenity = {
    id: string
    name: string
    description: string
    subtitle: string
    category: string
    categoryKey: string
    categoryLabel: string
    panoramaAssetId?: string
    linkedAssetId?: string
    linkedResourceId?: string
    routeColor?: string
    routeLine?: "solid" | "double" | "dashed"
    geometry: {
      type: "Point" | "LineString" | "Polygon"
      coordinates: unknown
    }
    distanceMeters: number | null
    estimatedTravelMinutes: number | null
    route?: PlaceRoute | null
    media: {
      cover: string | null
      gallery: readonly string[]
      video: string | null
    }
  }

  export type ExperiencePlayerData = {
    projectId: string
    apiOrigin: string
    map: {
      style: string
      terrain: boolean
      terrainExaggeration: number
      buildings3D: boolean
      fog: boolean
      roadsStyle?: {
        color: string
        width: number
        opacity: number
        line?: "solid" | "double" | "dashed"
      }
      availableLotColor?: string
      initialCamera: {
        longitude: number
        latitude: number
        zoom: number
        pitch: number
        bearing: number
      }
    }
    layers: {
      lots: boolean
      roads?: boolean
      locations: boolean
      models3D: boolean
    }
    amenityCategories: readonly {
      key: string
      label: string
      sortOrder: number
      color?: string
    }[]
    locations: readonly PublicAmenity[]
    assets: readonly {
      id: string
      name: string
      type: string
      url: string
      position: {
        longitude: number
        latitude: number
        altitude: number | null
      }
      transform: {
        rotation: readonly number[]
        scale: number
      }
    }[]
    lots: GeoJSON.FeatureCollection | null
    projectCenter: { longitude: number; latitude: number } | null
    scenes: readonly {
      id: string
      title: string
      camera: {
        longitude: number
        latitude: number
        zoom: number
        pitch: number
        bearing: number
      }
      durationMs: number
    }[]
  }

  export type LotClickPayload = {
    lotId: string | null
    number: string
    stageKey: string
    status: string | null
    area: number | null
    price: number | null
    lngLat: { longitude: number; latitude: number }
  }

  export type AmenitySelectPayload = {
    id: string
    name: string
    category: string
    categoryKey: string
    categoryLabel: string
    description: string
    subtitle?: string
    gallery: readonly string[]
    distanceMeters: number | null
    estimatedTravelMinutes: number | null
    lngLat: { longitude: number; latitude: number } | null
    source: "map" | "list"
  }

  export type ProjectExperienceProps = {
    projectId: string
    apiBaseUrl?: string
    mapboxAccessToken: string
    googleMapsApiKey?: string
    data?: ExperiencePlayerData
    amenitiesVisible?: boolean
    navigationVisible?: boolean
    onLotClick?: (lot: LotClickPayload) => void
    onAmenitySelect?: (amenity: AmenitySelectPayload) => void
    activeSceneId?: string | null
    scenePlaying?: boolean
    markerMotion?: "pulse" | "none"
    locale?: "en" | "es"
    labels?: Partial<{
      mapOptions: string
      recenter: string
      close: string
      view3d: string
      satellite: string
      travelTimes: string
      walking: string
      cycling: string
      driving: string
      minutesSuffix: string
      minutesAria: string
      travelError: string
    }>
  }

  export type RoadLineStyle = "solid" | "double" | "dashed"

  export function applyRoadLineStyle(
    map: import("mapbox-gl").Map,
    lineStyle: RoadLineStyle,
    roadsVisible: boolean
  ): void

  export function resolveRoadLine(line: string | undefined): RoadLineStyle

  export function ProjectExperience(props: ProjectExperienceProps): ReactElement
  export function loadPublishedExperience(params: {
    apiBaseUrl: string
    projectId: string
  }): Promise<ExperiencePlayerData>

  export type TourTurn = 1 | -1

  export function tourTurnFromBearings(bearings: readonly number[]): TourTurn

  export function playCameraMotion(params: {
    map: {
      getCenter: () => { lng: number; lat: number }
      getZoom: () => number
      getPitch: () => number
      getBearing: () => number
      jumpTo: (options: {
        center: [number, number]
        zoom: number
        pitch: number
        bearing: number
      }) => void
    }
    camera: {
      longitude: number
      latitude: number
      zoom: number
      pitch: number
      bearing: number
    }
    durationMs: number
    bearings: readonly number[]
    turn?: TourTurn
    signal: AbortSignal
  }): Promise<void>
}
