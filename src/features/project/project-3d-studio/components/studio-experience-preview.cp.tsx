import React, { useMemo } from "react"
import { useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { ProjectExperience } from "@omega/project-experience"
import type { ExperiencePlayerData, PublicAmenity } from "@omega/project-experience"
import {
  buildExperienceAssetUrl,
  resolveExperienceAssetUrl
} from "../utils/experience-asset-url.util"
import {
  applyLinkedResourceDraft,
  buildLinkedResourceModels
} from "../utils/linked-resource-model.util"
import { resolveMapStyleUrl } from "../utils/mapbox-map-presets.util"
import type { ProjectLocationType } from "../types/project-experience.types"

type Props = {
  projectId: string
}

function toPublicAmenity(
  location: ProjectLocationType,
  categoryLabel: string
): PublicAmenity {
  const gallery = (location.media?.gallery ?? []).map((fileName) =>
    buildExperienceAssetUrl(fileName)
  )
  const cover = location.media?.cover
    ? buildExperienceAssetUrl(location.media.cover)
    : gallery[0] ?? null
  return {
    id: String(location._id),
    name: location.name,
    description: location.description ?? "",
    subtitle: location.subtitle ?? "",
    category: location.category,
    categoryKey: location.categoryKey ?? "",
    categoryLabel,
    panoramaAssetId: location.panoramaAssetId || undefined,
    linkedAssetId: location.linkedAssetId || undefined,
    linkedResourceId: location.linkedResourceId || undefined,
    routeColor: location.routeColor || undefined,
    routeLine: location.routeLine || undefined,
    geometry: location.geometry,
    distanceMeters: location.distanceMeters,
    estimatedTravelMinutes: location.estimatedTravelMinutes,
    route: location.showRoute === false ? null : location.route ?? null,
    media: {
      cover,
      gallery,
      video: location.media?.video || null
    }
  }
}

export default function StudioExperiencePreviewCP({ projectId }: Props) {
  const {
    experience,
    locations,
    assets,
    resources,
    locationLinkDraft,
    projectLatLng,
    scenePlaying,
    activeSceneId
  } = useAppSelector((state: RootState) => state.project3dStudio)
  const lots = useAppSelector(
    (state: RootState) => state.lotInventory.mapPaint?.geojson ?? null
  )
  const token =
    (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined)?.trim() ?? ""
  const googleMapsApiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() ?? ""
  const data = useMemo<ExperiencePlayerData | null>(() => {
    if (!experience) return null
    const categories = experience.amenityCategories ?? []
    const labelFor = (key: string) =>
      categories.find((row) => row.key === key)?.label ?? ""
    const centerLng = experience.settings.centerLongitude ?? projectLatLng?.lng ?? 0
    const centerLat = experience.settings.centerLatitude ?? projectLatLng?.lat ?? 0
    return {
      projectId,
      apiOrigin: "",
      map: {
        style: resolveMapStyleUrl(experience.settings.styleUrl),
        terrain: experience.settings.terrainEnabled !== false,
        terrainExaggeration: experience.settings.terrainExaggeration || 1,
        buildings3D: experience.settings.buildings3DEnabled === true,
        fog: experience.settings.fogEnabled !== false,
        roadsStyle: experience.settings.roadsStyle,
        initialCamera: {
          longitude: centerLng,
          latitude: centerLat,
          zoom: experience.settings.defaultZoom,
          pitch: experience.settings.pitch,
          bearing: experience.settings.bearing
        }
      },
      layers: {
        lots: experience.layers.lots !== false,
        roads: experience.layers.roads !== false,
        locations: experience.layers.locations !== false,
        models3D: experience.layers.models3D !== false
      },
      amenityCategories: categories,
      locations: locations
        .filter((location) => location.isVisible !== false)
        .map((location) =>
          toPublicAmenity(location, labelFor(location.categoryKey ?? ""))
        ),
      assets: [
        ...assets
          .filter((asset) => asset.visible !== false)
          .map((asset) => ({
            id: String(asset._id),
            name: asset.name,
            type: asset.type,
            url: resolveExperienceAssetUrl(asset),
            position: asset.position,
            transform: {
              rotation: asset.transform.rotation ?? [0, 0, 0],
              scale: asset.transform.scale || 1
            }
          })),
        ...buildLinkedResourceModels(
          applyLinkedResourceDraft(locations, locationLinkDraft),
          resources
        ).map((model) => ({
          id: model.id,
          name: model.name,
          type: "model_3d",
          url: model.url,
          position: {
            longitude: model.longitude,
            latitude: model.latitude,
            altitude: model.altitude
          },
          transform: {
            rotation: [...model.rotation],
            scale: 1
          }
        }))
      ],
      lots: (lots as GeoJSON.FeatureCollection | null) ?? null,
      projectCenter: { longitude: centerLng, latitude: centerLat },
      scenes: [...(experience.scenes ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((scene) => ({
          id: scene.id,
          title: scene.title,
          camera: scene.camera,
          durationMs: scene.durationMs
        }))
    }
  }, [
    assets,
    experience,
    locationLinkDraft,
    locations,
    lots,
    projectId,
    projectLatLng,
    resources
  ])
  if (!data || !token) return null
  return (
    <ProjectExperience
      projectId={projectId}
      mapboxAccessToken={token}
      googleMapsApiKey={googleMapsApiKey || undefined}
      data={data}
      activeSceneId={activeSceneId}
      scenePlaying={scenePlaying}
      locale="es"
    />
  )
}
