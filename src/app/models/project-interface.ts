export interface ProjectInterface {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateProjectPayload {
  name: string;
}

export interface UpdateProjectPayload {
  name: string;
}
