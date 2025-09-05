import { Project, ProjectPermission } from '../types/buisness';
import { apiClient } from './client';

export class ProjectService {
  static async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return response.data;
  }

  static async getProject(id: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }

  static async createProject(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Project> {
    const response = await apiClient.post('/projects', project);
    return response.data;
  }

  static async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await apiClient.patch(`/projects/${id}`, project);
    return response.data;
  }

  static async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }

  static async getProjectPermissions(projectId: string): Promise<ProjectPermission[]> {
    const response = await apiClient.get(`/projects/${projectId}/permissions`);
    return response.data;
  }

  static async addProjectPermission(
    projectId: string,
    permission: Omit<ProjectPermission, 'proj_id'>,
  ): Promise<ProjectPermission> {
    const response = await apiClient.post(`/projects/${projectId}/permissions`, permission);
    return response.data;
  }

  static async updateProjectPermission(
    projectId: string,
    userId: string,
    permission: Partial<ProjectPermission>,
  ): Promise<ProjectPermission> {
    const response = await apiClient.put(
      `/projects/${projectId}/permissions/${userId}`,
      permission,
    );
    return response.data;
  }

  static async removeProjectPermission(projectId: string, userId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/permissions/${userId}`);
  }
}
