import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AxiosError } from "axios"
import {
  getProjectByIdReq,
  updateProjectReq
} from "../../../../app/services/project.service"
import {
  createExperienceLocationReq,
  deleteExperienceAssetReq,
  deleteExperienceLocationReq,
  deleteExperienceResourceReq,
  disableExperienceReq,
  discoverExperienceLocationsReq,
  fetchExperienceAssetsReq,
  fetchExperienceLocationsReq,
  fetchExperienceResourcesReq,
  fetchProjectExperienceReq,
  importExperienceLocationsGeoJsonReq,
  placeExperienceAssetReq,
  publishExperienceReq,
  updateExperienceAssetReq,
  updateExperienceLocationReq,
  updateProjectExperienceReq,
  uploadExperienceAssetReq,
  uploadExperienceResourceReq,
  uploadLocationGalleryReq,
  upsertExperienceScenesReq,
  verifyExperienceLocationReq
} from "../../../../app/services/project-experience.service"
import type {
  CreateLocationPayload,
  ExperienceSceneType,
  LocationGeometry,
  PlaceAssetPayload,
  ProjectExperienceAssetType,
  ProjectLatLng,
  ProjectLocationCategory,
  StudioPanel,
  StudioSelection,
  StudioTool,
  AmenityCategoryType,
  UpdateAssetPayload,
  UpdateExperiencePayload,
  UpdateLocationPayload
} from "../types/project-experience.types"
import { toProjectLatLng } from "../utils/project-coords.util"
import type { Project3dStudioState } from "./project-3d-studio.state"

const pendingLocationGeometry = new Map<string, LocationGeometry>()

const initialState: Project3dStudioState = {
  projectId: null,
  projectLatLng: null,
  experience: null,
  locations: [],
  assets: [],
  resources: [],
  discoverCandidates: [],
  selectedDiscoverSourceIds: [],
  livePreviewCandidates: [],
  loading: false,
  error: null,
  actionLoading: false,
  discoverLoading: false,
  discoverProvider: null,
  discoverWarnings: [],
  discoverError: null,
  activePanel: "locations",
  activeTool: "select",
  selection: null,
  previewMode: false,
  dirty: false,
  scenePlaying: false,
  activeSceneId: null,
  mapCamera: null,
  pendingAssetPosition: null,
  placingAssetId: null,
  relocatingLocationId: null,
  discoverRadiusMeters: 10000
}

export const loadStudioThunk = createAsyncThunk(
  "project3dStudio/load",
  async (projectId: string) => {
    const [project, experience, locations, assets, resources] =
      await Promise.all([
        getProjectByIdReq({ id: projectId }),
        fetchProjectExperienceReq(projectId),
        fetchExperienceLocationsReq(projectId),
        fetchExperienceAssetsReq(projectId),
        fetchExperienceResourcesReq(projectId)
      ])
    return {
      projectId,
      projectLatLng: toProjectLatLng(project.lat, project.lng),
      experience,
      locations,
      assets,
      resources
    }
  }
)

export const updateProjectLatLngThunk = createAsyncThunk(
  "project3dStudio/updateProjectLatLng",
  async (params: { projectId: string; lat: number; lng: number }) => {
    const project = await updateProjectReq({
      id: params.projectId,
      data: { lat: params.lat, lng: params.lng }
    })
    const experience = await updateProjectExperienceReq({
      projectId: params.projectId,
      data: {
        settings: {
          centerLatitude: params.lat,
          centerLongitude: params.lng
        }
      }
    })
    return {
      projectLatLng: toProjectLatLng(project.lat, project.lng) ?? {
        lat: params.lat,
        lng: params.lng
      },
      experience
    }
  }
)

export const updateExperienceThunk = createAsyncThunk(
  "project3dStudio/updateExperience",
  async (params: { projectId: string; data: UpdateExperiencePayload }) =>
    updateProjectExperienceReq(params)
)

export const upsertScenesThunk = createAsyncThunk(
  "project3dStudio/upsertScenes",
  async (params: { projectId: string; scenes: ExperienceSceneType[] }) =>
    upsertExperienceScenesReq(params)
)

export const publishExperienceThunk = createAsyncThunk(
  "project3dStudio/publish",
  async (projectId: string) => publishExperienceReq(projectId)
)

export const disableExperienceThunk = createAsyncThunk(
  "project3dStudio/disable",
  async (projectId: string) => disableExperienceReq(projectId)
)

export const createLocationThunk = createAsyncThunk(
  "project3dStudio/createLocation",
  async (params: { projectId: string; data: CreateLocationPayload }) =>
    createExperienceLocationReq(params)
)

export const updateLocationThunk = createAsyncThunk(
  "project3dStudio/updateLocation",
  async (params: {
    projectId: string
    locationId: string
    data: UpdateLocationPayload
  }) => updateExperienceLocationReq(params)
)

export const deleteLocationThunk = createAsyncThunk(
  "project3dStudio/deleteLocation",
  async (params: { projectId: string; locationId: string }) => {
    await deleteExperienceLocationReq(params)
    return params.locationId
  }
)

export const deleteLocationsBulkThunk = createAsyncThunk(
  "project3dStudio/deleteLocationsBulk",
  async (params: { projectId: string; locationIds: string[] }) => {
    await Promise.all(
      params.locationIds.map((locationId) =>
        deleteExperienceLocationReq({
          projectId: params.projectId,
          locationId
        })
      )
    )
    return params.locationIds
  }
)

export const uploadLocationGalleryThunk = createAsyncThunk(
  "project3dStudio/uploadLocationGallery",
  async (params: { projectId: string; locationId: string; files: File[] }) =>
    uploadLocationGalleryReq(params)
)

export const verifyLocationThunk = createAsyncThunk(
  "project3dStudio/verifyLocation",
  async (params: { projectId: string; locationId: string }) =>
    verifyExperienceLocationReq(params)
)

export const discoverLocationsThunk = createAsyncThunk(
  "project3dStudio/discover",
  async (
    params: {
      projectId: string
      radiusMeters: number
      categories?: ProjectLocationCategory[]
    },
    { rejectWithValue }
  ) => {
    try {
      return await discoverExperienceLocationsReq(params)
    } catch (error) {
      const e = error as AxiosError<{ message?: string | string[] }>
      const message = e.response?.data?.message
      return rejectWithValue(
        Array.isArray(message) ? message.join(", ") : message ?? e.message
      )
    }
  }
)

export const loadLivePreviewThunk = createAsyncThunk(
  "project3dStudio/livePreview",
  async (
    params: {
      projectId: string
      radiusMeters: number
      categories?: ProjectLocationCategory[]
    },
    { rejectWithValue }
  ) => {
    try {
      return await discoverExperienceLocationsReq(params)
    } catch (error) {
      const e = error as AxiosError<{ message?: string | string[] }>
      const message = e.response?.data?.message
      return rejectWithValue(
        Array.isArray(message) ? message.join(", ") : message ?? e.message
      )
    }
  }
)

export const importLocationsGeoJsonThunk = createAsyncThunk(
  "project3dStudio/importGeoJson",
  async (params: { projectId: string; file: File }) =>
    importExperienceLocationsGeoJsonReq(params)
)

export const uploadAssetThunk = createAsyncThunk(
  "project3dStudio/uploadAsset",
  async (params: {
    projectId: string
    file: File
    type: ProjectExperienceAssetType
    name?: string
    longitude?: number
    latitude?: number
    altitude?: number | null
  }) => uploadExperienceAssetReq(params)
)

export const uploadResourceThunk = createAsyncThunk(
  "project3dStudio/uploadResource",
  async (params: {
    projectId: string
    file: File
    type: ProjectExperienceAssetType
    name?: string
  }) => uploadExperienceResourceReq(params)
)

export const deleteResourceThunk = createAsyncThunk(
  "project3dStudio/deleteResource",
  async (params: { projectId: string; resourceId: string }) => {
    const result = await deleteExperienceResourceReq(params)
    return {
      resourceId: params.resourceId,
      deletedPlacementIds: result?.deletedPlacementIds ?? []
    }
  }
)

export const placeAssetFromResourceThunk = createAsyncThunk(
  "project3dStudio/placeAssetFromResource",
  async (params: { projectId: string; data: PlaceAssetPayload }) =>
    placeExperienceAssetReq(params)
)

export const updateAssetThunk = createAsyncThunk(
  "project3dStudio/updateAsset",
  async (params: {
    projectId: string
    assetId: string
    data: UpdateAssetPayload
  }) => updateExperienceAssetReq(params)
)

export const deleteAssetThunk = createAsyncThunk(
  "project3dStudio/deleteAsset",
  async (params: { projectId: string; assetId: string }) => {
    await deleteExperienceAssetReq(params)
    return params.assetId
  }
)

const project3dStudioSlice = createSlice({
  name: "project3dStudio",
  initialState,
  reducers: {
    resetStudioAct: () => initialState,
    setActivePanelAct: (state, action: PayloadAction<StudioPanel>) => {
      state.activePanel = action.payload
    },
    setAmenityCategoriesAct: (
      state,
      action: PayloadAction<AmenityCategoryType[]>
    ) => {
      if (!state.experience) return
      state.experience.amenityCategories = action.payload
    },
    setActiveToolAct: (state, action: PayloadAction<StudioTool>) => {
      state.activeTool = action.payload
      if (action.payload !== "placeAsset") {
        state.placingAssetId = null
      }
      if (action.payload !== "relocateLocation") {
        state.relocatingLocationId = null
      }
    },
    setRelocatingLocationIdAct: (state, action: PayloadAction<string | null>) => {
      state.relocatingLocationId = action.payload
      state.activeTool = action.payload ? "relocateLocation" : "select"
      if (action.payload) state.placingAssetId = null
    },
    setSelectionAct: (state, action: PayloadAction<StudioSelection>) => {
      state.selection = action.payload
    },
    setPlacingAssetIdAct: (state, action: PayloadAction<string | null>) => {
      state.placingAssetId = action.payload
    },
    setPreviewModeAct: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload
      if (!action.payload) {
        state.livePreviewCandidates = []
      }
    },
    clearLivePreviewAct: (state) => {
      state.livePreviewCandidates = []
    },
    setDirtyAct: (state, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setScenePlayingAct: (state, action: PayloadAction<boolean>) => {
      state.scenePlaying = action.payload
    },
    setActiveSceneIdAct: (state, action: PayloadAction<string | null>) => {
      state.activeSceneId = action.payload
    },
    setMapCameraAct: (
      state,
      action: PayloadAction<Project3dStudioState["mapCamera"]>
    ) => {
      state.mapCamera = action.payload
    },
    setPendingAssetPositionAct: (
      state,
      action: PayloadAction<ProjectLatLng | null>
    ) => {
      state.pendingAssetPosition = action.payload
    },
    setDiscoverRadiusAct: (state, action: PayloadAction<number>) => {
      state.discoverRadiusMeters = action.payload
    },
    toggleDiscoverCandidateAct: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.selectedDiscoverSourceIds.includes(id)) {
        state.selectedDiscoverSourceIds =
          state.selectedDiscoverSourceIds.filter((x) => x !== id)
      } else {
        state.selectedDiscoverSourceIds.push(id)
      }
    },
    clearDiscoverAct: (state) => {
      state.discoverCandidates = []
      state.selectedDiscoverSourceIds = []
      state.discoverProvider = null
      state.discoverWarnings = []
      state.discoverError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudioThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadStudioThunk.fulfilled, (state, action) => {
        state.loading = false
        state.projectId = action.payload.projectId
        state.experience = action.payload.experience
        state.projectLatLng = action.payload.projectLatLng
        state.locations = action.payload.locations
        state.assets = action.payload.assets
        state.resources = action.payload.resources
        state.dirty = false
        if (!action.payload.projectLatLng) {
          state.activeTool = "setProjectPin"
        }
      })
      .addCase(loadStudioThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "load failed"
      })
      .addCase(updateExperienceThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(updateExperienceThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.experience = action.payload
        state.dirty = false
      })
      .addCase(updateExperienceThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(updateProjectLatLngThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(updateProjectLatLngThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.projectLatLng = action.payload.projectLatLng
        state.experience = action.payload.experience
        state.activeTool = "select"
      })
      .addCase(updateProjectLatLngThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(upsertScenesThunk.fulfilled, (state, action) => {
        state.experience = action.payload
        state.dirty = false
      })
      .addCase(publishExperienceThunk.fulfilled, (state, action) => {
        state.experience = action.payload
        state.dirty = false
      })
      .addCase(disableExperienceThunk.fulfilled, (state, action) => {
        state.experience = action.payload
      })
      .addCase(createLocationThunk.fulfilled, (state, action) => {
        state.locations.push(action.payload)
      })
      .addCase(updateLocationThunk.pending, (state, action) => {
        const nextGeometry = action.meta.arg.data.geometry
        if (!nextGeometry) return
        const location = state.locations.find(
          (row) => row._id === action.meta.arg.locationId
        )
        if (!location) return
        pendingLocationGeometry.set(action.meta.requestId, location.geometry)
        location.geometry = nextGeometry
      })
      .addCase(updateLocationThunk.fulfilled, (state, action) => {
        pendingLocationGeometry.delete(action.meta.requestId)
        const idx = state.locations.findIndex(
          (l) => l._id === action.payload._id
        )
        if (idx >= 0) state.locations[idx] = action.payload
      })
      .addCase(updateLocationThunk.rejected, (state, action) => {
        const previous = pendingLocationGeometry.get(action.meta.requestId)
        pendingLocationGeometry.delete(action.meta.requestId)
        if (!previous) return
        const location = state.locations.find(
          (row) => row._id === action.meta.arg.locationId
        )
        if (location) location.geometry = previous
      })
      .addCase(uploadLocationGalleryThunk.fulfilled, (state, action) => {
        const idx = state.locations.findIndex(
          (l) => l._id === action.payload._id
        )
        if (idx >= 0) state.locations[idx] = action.payload
      })
      .addCase(deleteLocationThunk.fulfilled, (state, action) => {
        state.locations = state.locations.filter(
          (l) => l._id !== action.payload
        )
        if (
          state.selection?.kind === "location" &&
          state.selection.id === action.payload
        ) {
          state.selection = null
        }
      })
      .addCase(deleteLocationsBulkThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteLocationsBulkThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const removed = new Set(action.payload)
        state.locations = state.locations.filter((l) => !removed.has(l._id))
        if (
          state.selection?.kind === "location" &&
          removed.has(state.selection.id)
        ) {
          state.selection = null
        }
      })
      .addCase(deleteLocationsBulkThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(verifyLocationThunk.fulfilled, (state, action) => {
        const idx = state.locations.findIndex(
          (l) => l._id === action.payload._id
        )
        if (idx >= 0) state.locations[idx] = action.payload
      })
      .addCase(discoverLocationsThunk.pending, (state) => {
        state.discoverLoading = true
        state.discoverError = null
        state.discoverWarnings = []
      })
      .addCase(discoverLocationsThunk.fulfilled, (state, action) => {
        state.discoverLoading = false
        state.discoverCandidates = action.payload.candidates
        state.discoverProvider = action.payload.provider
        state.discoverWarnings = action.payload.warnings
        state.selectedDiscoverSourceIds = []
      })
      .addCase(discoverLocationsThunk.rejected, (state, action) => {
        state.discoverLoading = false
        state.discoverCandidates = []
        state.discoverError =
          (action.payload as string | undefined) ??
          action.error.message ??
          "unknown"
      })
      .addCase(loadLivePreviewThunk.fulfilled, (state, action) => {
        state.livePreviewCandidates = action.payload.candidates
      })
      .addCase(loadLivePreviewThunk.rejected, (state) => {
        state.livePreviewCandidates = []
      })
      .addCase(importLocationsGeoJsonThunk.fulfilled, (state, action) => {
        state.locations = [...state.locations, ...action.payload.locations]
      })
      .addCase(uploadAssetThunk.fulfilled, (state, action) => {
        state.pendingAssetPosition = null
        state.activeTool = "select"
        state.assets.push(action.payload)
      })
      .addCase(uploadResourceThunk.fulfilled, (state, action) => {
        state.resources = [action.payload, ...state.resources]
      })
      .addCase(deleteResourceThunk.fulfilled, (state, action) => {
        const { resourceId, deletedPlacementIds } = action.payload
        state.resources = state.resources.filter((row) => row._id !== resourceId)
        if (deletedPlacementIds.length > 0) {
          const removed = new Set(deletedPlacementIds)
          state.assets = state.assets.filter((row) => !removed.has(row._id))
          if (
            state.selection?.kind === "asset" &&
            removed.has(state.selection.id)
          ) {
            state.selection = null
          }
        }
      })
      .addCase(placeAssetFromResourceThunk.fulfilled, (state, action) => {
        state.pendingAssetPosition = null
        state.activeTool = "select"
        state.assets.push(action.payload)
      })
      .addCase(updateAssetThunk.fulfilled, (state, action) => {
        const requestedId = String(action.meta.arg.assetId ?? "")
        const payloadId = String(action.payload?._id ?? requestedId)
        if (!payloadId) return
        const idx = state.assets.findIndex(
          (a) => String(a._id) === payloadId || String(a._id) === requestedId
        )
        if (idx < 0) return
        const previous = state.assets[idx]
        state.assets[idx] = {
          ...previous,
          ...action.payload,
          _id: previous._id,
          position: {
            ...previous.position,
            ...(action.payload.position ?? {})
          },
          transform: {
            ...previous.transform,
            ...(action.payload.transform ?? {})
          }
        }
        if (state.placingAssetId && String(state.placingAssetId) === requestedId) {
          state.placingAssetId = null
        }
      })
      .addCase(deleteAssetThunk.fulfilled, (state, action) => {
        const removedId = String(action.payload)
        state.assets = state.assets.filter(
          (a) => String(a._id) !== removedId
        )
        if (
          state.selection?.kind === "asset" &&
          String(state.selection.id) === removedId
        ) {
          state.selection = null
        }
      })
  }
})

export const {
  resetStudioAct,
  setActivePanelAct,
  setAmenityCategoriesAct,
  setActiveToolAct,
  setSelectionAct,
  setPlacingAssetIdAct,
  setRelocatingLocationIdAct,
  setPreviewModeAct,
  setDirtyAct,
  setScenePlayingAct,
  setActiveSceneIdAct,
  setMapCameraAct,
  setPendingAssetPositionAct,
  setDiscoverRadiusAct,
  toggleDiscoverCandidateAct,
  clearDiscoverAct
} = project3dStudioSlice.actions

export default project3dStudioSlice.reducer
