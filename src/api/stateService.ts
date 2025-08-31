import { apiClient } from './client';

export class StateService {
  static async getState(stateName: string): Promise<Blob> {
    const response = await apiClient.get(`/state/${stateName}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  static async putState(stateName: string, stateData: Blob | string): Promise<void> {
    await apiClient.post(`/state/${stateName}`, stateData, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }

  static async deleteState(stateName: string): Promise<void> {
    await apiClient.delete(`/state/${stateName}`);
  }
}
