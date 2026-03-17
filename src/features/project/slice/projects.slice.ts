import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CreateProjectDto, ProjectType, UpdateProjectDto } from "../types/project.types"
import {
  fetchProjectsReq,
  getProjectByIdReq,
  createProjectReq,
  updateProjectReq,
  deleteProjectReq,
  uploadProjectImageReq,
  deleteProjectImageReq,
  setProjectEnabledReq
} from "../../../app/services/project.service"
import { ProjectsState } from "./projects.state"

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null
}

export const fetchProjectsThunk = createAsyncThunk(
  "project/fetchProjects",
  async () => {
    return fetchProjectsReq()
  }
)

export const getProjectByIdThunk = createAsyncThunk(
  "project/getProjectById",
  async (id: string) => {
    return getProjectByIdReq({ id })
  }
)

export const createProjectThunk = createAsyncThunk(
  "project/createProject",
  async (data: CreateProjectDto) => {
    return createProjectReq({ data })
  }
)

export const updateProjectThunk = createAsyncThunk(
  "project/updateProject",
  async ({ id, data }: { id: string; data: UpdateProjectDto }) => {
    return updateProjectReq({ id, data })
  }
)

export const deleteProjectThunk = createAsyncThunk(
  "project/deleteProject",
  async (id: string) => {
    await deleteProjectReq({ id })
    return id
  }
)

export const setProjectEnabledThunk = createAsyncThunk(
  "project/setProjectEnabled",
  async ({ id, enabled }: { id: string; enabled: boolean }) => {
    return setProjectEnabledReq({ id, enabled })
  }
)

export const uploadProjectImageThunk = createAsyncThunk(
  "project/uploadProjectImage",
  async ({ projectId, file }: { projectId: string; file: File }) => {
    return uploadProjectImageReq({ projectId, file })
  }
)

export const removeProjectImageThunk = createAsyncThunk(
  "project/removeProjectImage",
  async ({
    projectId,
    imageName
  }: {
    projectId: string
    imageName: string
  }) => {
    return deleteProjectImageReq({ projectId, imageName })
  }
)

const projectsSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentProjectAct: (state, action: PayloadAction<ProjectType | null>) => {
      state.currentProject = action.payload
    },
    clearProjectErrorAct: (state) => {
      state.error = null
    },
    setProjectErrorAct: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
        state.error = null
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error fetching projects"
      })
      .addCase(getProjectByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProjectByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
        state.error = null
      })
      .addCase(getProjectByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error fetching project"
      })
      .addCase(createProjectThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects.push(action.payload)
        state.currentProject = action.payload
        state.error = null
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error creating project"
      })
      .addCase(updateProjectThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const idx = state.projects.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.projects[idx] = action.payload
        state.currentProject = action.payload
        state.error = null
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error updating project"
      })
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload)
        if (state.currentProject?._id === action.payload) state.currentProject = null
      })
      .addCase(setProjectEnabledThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const idx = state.projects.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.projects[idx] = action.payload
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload
        }
      })
      .addCase(uploadProjectImageThunk.fulfilled, (state, action) => {
        if (action.payload && state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload
        }
        if (action.payload) {
          const p = state.projects.find((x) => x._id === action.payload!._id)
          if (p) p.images = action.payload.images
        }
      })
      .addCase(removeProjectImageThunk.fulfilled, (state, action) => {
        if (action.payload && state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload
        }
        if (action.payload) {
          const p = state.projects.find((x) => x._id === action.payload!._id)
          if (p) p.images = action.payload.images
        }
      })
  }
})

export const { setCurrentProjectAct, clearProjectErrorAct, setProjectErrorAct } = projectsSlice.actions
export default projectsSlice.reducer
