import Api from "../axios";
import { ProjectInterface, CreateProjectPayload, UpdateProjectPayload } from "../models/project-interface";

const api = new Api();

export async function fetchProjectsReq(): Promise<ProjectInterface[]> {
  try {
    const response = await api.get({ path: "projects" });
    const { error } = response;
    if (error === null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error('ERROR ON fetchProjectsReq');
    console.error({error});
    throw error;
  }
}

export async function createProjectReq({ project }: { project: CreateProjectPayload }): Promise<ProjectInterface> {
  try {
    const response = await api.post({ path: "projects", data: project });
    const { error } = response;
    if (error === null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error('ERROR ON createProjectReq');
    console.error({error});
    throw error;
  }
}

export async function updateProjectReq({ id, project }: { id: string; project: UpdateProjectPayload }): Promise<ProjectInterface> {
  try {
    const response = await api.patch({ path: `projects/${id}`, data: project });
    const { error } = response;
    if (error === null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error('ERROR ON updateProjectReq');
    console.error({error});
    throw error;
  }
}
