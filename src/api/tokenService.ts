import { AuthToken, ProjectToken } from '../types/buisness';
import { apiClient } from './client';

export class TokenService {
  static async getTokens(): Promise<ProjectToken[]> {
    const response = await apiClient.get('/tokens');
    return response.data;
  }

  static async getToken(id: string): Promise<AuthToken> {
    const response = await apiClient.get(`/tokens/${id}`);
    return response.data;
  }

  static async getUserTokens(userId: string): Promise<AuthToken[]> {
    const response = await apiClient.get(`/users/${userId}/tokens`);
    return response.data;
  }

  static async createToken(tokenData: { project_id: string }): Promise<ProjectToken> {
    const response = await apiClient.post('/tokens', tokenData);
    return response.data;
  }

  static async revokeToken(id: string): Promise<void> {
    await apiClient.delete(`/tokens/${id}`);
  }

  static async revokeUserTokens(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/tokens`);
  }

  static async refreshToken(tokenId: string): Promise<AuthToken> {
    const response = await apiClient.post(`/tokens/${tokenId}/refresh`);
    return response.data;
  }

  // Project token
  static async getProjectTokens(): Promise<ProjectToken[]> {
    const response = await apiClient.get(`/tokens`);
    return response.data;
  }

  static async createProjectToken(token: Omit<ProjectToken, 'token'>): Promise<ProjectToken> {
    const response = await apiClient.post(`/tokens`, token);
    return response.data;
  }

  static async deleteProjectToken(token: string): Promise<void> {
    const response = await apiClient.delete(`/tokens/${token}`);
    return response.data;
  }
}
