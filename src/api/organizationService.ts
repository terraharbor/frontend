import { apiClient } from './client';
import { Organization, OrganizationPermission, User, Team, Project } from '../types/buisness';

export class OrganizationService {
  static async getOrganizations(): Promise<Organization[]> {
    const response = await apiClient.get('/organizations');
    return response.data;
  }

  static async getOrganization(id: string): Promise<Organization> {
    const response = await apiClient.get(`/organizations/${id}`);
    return response.data;
  }

  static async createOrganization(organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
    const response = await apiClient.post('/organizations', organization);
    return response.data;
  }

  static async updateOrganization(id: string, organization: Partial<Organization>): Promise<Organization> {
    const response = await apiClient.put(`/organizations/${id}`, organization);
    return response.data;
  }

  static async deleteOrganization(id: string): Promise<void> {
    await apiClient.delete(`/organizations/${id}`);
  }

  static async getOrganizationMembers(organizationId: string): Promise<User[]> {
    const response = await apiClient.get(`/organizations/${organizationId}/members`);
    return response.data;
  }

  static async getOrganizationTeams(organizationId: string): Promise<Team[]> {
    const response = await apiClient.get(`/organizations/${organizationId}/teams`);
    return response.data;
  }

  static async getOrganizationProjects(organizationId: string): Promise<Project[]> {
    const response = await apiClient.get(`/organizations/${organizationId}/projects`);
    return response.data;
  }

  static async getOrganizationPermissions(organizationId: string): Promise<OrganizationPermission[]> {
    const response = await apiClient.get(`/organizations/${organizationId}/permissions`);
    return response.data;
  }

  static async addOrganizationPermission(organizationId: string, permission: Omit<OrganizationPermission, 'org_id'>): Promise<OrganizationPermission> {
    const response = await apiClient.post(`/organizations/${organizationId}/permissions`, permission);
    return response.data;
  }

  static async updateOrganizationPermission(organizationId: string, userId: string, permission: Partial<OrganizationPermission>): Promise<OrganizationPermission> {
    const response = await apiClient.put(`/organizations/${organizationId}/permissions/${userId}`, permission);
    return response.data;
  }

  static async removeOrganizationPermission(organizationId: string, userId: string): Promise<void> {
    await apiClient.delete(`/organizations/${organizationId}/permissions/${userId}`);
  }
}
