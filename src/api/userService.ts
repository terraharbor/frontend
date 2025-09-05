import { Project, Team, User } from '../types/buisness';
import { apiClient } from './client';

export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    console.log(response);
    return response.data;
  }

  static async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await apiClient.post('/users', user);
    return response.data;
  }

  static async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await apiClient.patch(`/users/${id}`, user);
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  static async getUserTeams(userId: string): Promise<Team[]> {
    const response = await apiClient.get(`/users/${userId}/teams`);
    return response.data;
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    const response = await apiClient.get(`/users/${userId}/projects`);
    return response.data;
  }

  static async addUserToOrganization(userId: string, organizationId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/organizations`, { organizationId });
  }

  static async removeUserFromOrganization(userId: string, organizationId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/organizations/${organizationId}`);
  }
}
