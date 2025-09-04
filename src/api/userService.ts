import { apiClient } from './client';
import { User, Organization, Team } from '../types/buisness';

export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
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
    const response = await apiClient.put(`/users/${id}`, user);
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  static async getUserOrganizations(userId: string): Promise<Organization[]> {
    const response = await apiClient.get(`/users/${userId}/organizations`);
    return response.data;
  }

  static async getUserTeams(userId: string): Promise<Team[]> {
    const response = await apiClient.get(`/users/${userId}/teams`);
    return response.data;
  }

  static async addUserToOrganization(userId: string, organizationId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/organizations`, { organizationId });
  }

  static async removeUserFromOrganization(userId: string, organizationId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/organizations/${organizationId}`);
  }
}
