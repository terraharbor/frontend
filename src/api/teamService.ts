import { Project, Team, User } from '../types/buisness';
import { apiClient } from './client';

export class TeamService {
  static async getTeams(): Promise<Team[]> {
    const response = await apiClient.get('/teams');
    return response.data;
  }

  static async getTeam(id: string): Promise<Team> {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  }

  static async createTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> {
    const response = await apiClient.post('/teams', team);
    return response.data;
  }

  static async updateTeam(id: string, team: Partial<Team>): Promise<Team> {
    const response = await apiClient.put(`/teams/${id}`, team);
    return response.data;
  }

  static async deleteTeam(id: string): Promise<void> {
    await apiClient.delete(`/teams/${id}`);
  }

  static async getTeamMembers(teamId: string): Promise<User[]> {
    const response = await apiClient.get(`/teams/${teamId}/users`);
    return response.data;
  }

  static async addTeamMember(teamId: string, userId: string): Promise<void> {
    await apiClient.post(`/teams/${teamId}/users`, { userId });
  }

  static async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/users/${userId}`);
  }

  static async getTeamProjects(teamId: string): Promise<Project[]> {
    const response = await apiClient.get(`/teams/${teamId}/projects`);
    return response.data;
  }
}
