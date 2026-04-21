import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type {
  CreateProjectReleaseDto,
  ProjectRelease,
  ProjectReleaseListStatus,
  UpdateProjectReleaseDto
} from "../types/project-release.types"
import {
  fetchProjectReleasesReq,
  getProjectReleaseByIdReq,
  createProjectReleaseReq,
  updateProjectReleaseReq,
  setProjectReleaseEnabledReq,
  uploadProjectReleaseImageReq,
  deleteProjectReleaseImageReq
} from "../../../app/services/project-releases.service"
import type { ProjectReleasesState } from "./project-releases.state"

const projectReleasesInitialState: ProjectReleasesState = {
  items: [],
  listTab: "enabled",
  current: null,
  isLoading: false,
  error: null
}

function releaseMatchesTab(release: ProjectRelease, tab: ProjectReleaseListStatus) {
  return release.enabled === (tab === "enabled")
}

function mergeReleaseIntoItems(state: ProjectReleasesState, release: ProjectRelease) {
  const idx = state.items.findIndex((r) => r._id === release._id)
  const matches = releaseMatchesTab(release, state.listTab)
  if (matches) {
    if (idx >= 0) state.items[idx] = release
    else state.items.push(release)
  } else if (idx >= 0) {
    state.items.splice(idx, 1)
  }
  if (state.current?._id === release._id) {
    state.current = release
  }
}

export const fetchProjectReleasesThunk = createAsyncThunk(
  "projectReleases/fetchList",
  async (status: ProjectReleaseListStatus) => {
    return fetchProjectReleasesReq(status)
  }
)

export const getProjectReleaseByIdThunk = createAsyncThunk(
  "projectReleases/getById",
  async (id: string) => {
    return getProjectReleaseByIdReq(id)
  }
)

export const createProjectReleaseThunk = createAsyncThunk(
  "projectReleases/create",
  async (data: CreateProjectReleaseDto) => {
    return createProjectReleaseReq(data)
  }
)

export const updateProjectReleaseThunk = createAsyncThunk(
  "projectReleases/update",
  async ({ id, data }: { id: string; data: UpdateProjectReleaseDto }) => {
    return updateProjectReleaseReq(id, data)
  }
)

export const setProjectReleaseEnabledThunk = createAsyncThunk(
  "projectReleases/setEnabled",
  async ({ id, enabled }: { id: string; enabled: boolean }) => {
    return setProjectReleaseEnabledReq(id, enabled)
  }
)

export const uploadProjectReleaseImageThunk = createAsyncThunk(
  "projectReleases/uploadImage",
  async ({ releaseId, file }: { releaseId: string; file: File }) => {
    return uploadProjectReleaseImageReq({ releaseId, file })
  }
)

export const deleteProjectReleaseImageThunk = createAsyncThunk(
  "projectReleases/deleteImage",
  async ({ releaseId, imageName }: { releaseId: string; imageName: string }) => {
    return deleteProjectReleaseImageReq({ releaseId, imageName })
  }
)

const projectReleasesSlice = createSlice({
  name: "projectReleases",
  initialState: projectReleasesInitialState,
  reducers: {
    setListTabAct: (state, action: PayloadAction<ProjectReleaseListStatus>) => {
      state.listTab = action.payload
    },
    setCurrentReleaseAct: (state, action: PayloadAction<ProjectRelease | null>) => {
      state.current = action.payload
    },
    clearProjectReleasesErrorAct: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectReleasesThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjectReleasesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchProjectReleasesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar proyectos finalizados"
      })
      .addCase(getProjectReleaseByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProjectReleaseByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.current = action.payload
        state.error = null
      })
      .addCase(getProjectReleaseByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar el registro"
      })
      .addCase(createProjectReleaseThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProjectReleaseThunk.fulfilled, (state, action) => {
        state.isLoading = false
        mergeReleaseIntoItems(state, action.payload)
        state.current = action.payload
        state.error = null
      })
      .addCase(createProjectReleaseThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al crear"
      })
      .addCase(updateProjectReleaseThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProjectReleaseThunk.fulfilled, (state, action) => {
        state.isLoading = false
        mergeReleaseIntoItems(state, action.payload)
        state.current = action.payload
        state.error = null
      })
      .addCase(updateProjectReleaseThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al actualizar"
      })
      .addCase(setProjectReleaseEnabledThunk.fulfilled, (state, action) => {
        mergeReleaseIntoItems(state, action.payload)
      })
      .addCase(setProjectReleaseEnabledThunk.rejected, (state, action) => {
        state.error = action.error.message ?? "Error al cambiar visibilidad"
      })
      .addCase(uploadProjectReleaseImageThunk.fulfilled, (state, action) => {
        mergeReleaseIntoItems(state, action.payload)
      })
      .addCase(deleteProjectReleaseImageThunk.fulfilled, (state, action) => {
        mergeReleaseIntoItems(state, action.payload)
      })
  }
})

export const { setListTabAct, setCurrentReleaseAct, clearProjectReleasesErrorAct } =
  projectReleasesSlice.actions

export default projectReleasesSlice.reducer
