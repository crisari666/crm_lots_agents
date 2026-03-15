import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectInterface, CreateProjectPayload, UpdateProjectPayload } from '../../app/models/project-interface';
import { fetchProjectsReq, createProjectReq, updateProjectReq } from '../../app/services/projects.service';

export type ProjectsState = {
  projects: ProjectInterface[];
  isLoading: boolean;
  error: string | null;
  selectedProject: ProjectInterface | null;
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
  selectedProject: null,
};

export const fetchProjectsThunk = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetchProjectsReq();
    return response;
  }
);

export const createProjectThunk = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectPayload) => {
    const response = await createProjectReq({ project: projectData });
    return response;
  }
);

export const updateProjectThunk = createAsyncThunk(
  'projects/updateProject',
  async ({ id, project }: { id: string; project: UpdateProjectPayload }) => {
    const response = await updateProjectReq({ id, project });
    return response;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectInterface[]>) => {
      state.projects = action.payload;
      state.error = null;
    },
    addProject: (state, action: PayloadAction<ProjectInterface>) => {
      state.projects.push(action.payload);
      state.error = null;
    },
    updateProject: (state, action: PayloadAction<ProjectInterface>) => {
      const index = state.projects.findIndex(project => project._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProject: (state, action: PayloadAction<ProjectInterface | null>) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error fetching projects';
      })
      .addCase(createProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error creating project';
      })
      .addCase(updateProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error updating project';
      });
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  setLoading,
  setError,
  clearError,
  setSelectedProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;
