import { apiClient } from './client';

export interface StateVersionInfo {
  version: string;
  'created by': string | null;
  'upload date': string | null;
}

export class StateService {
  static async getState(project: string, stateName: string, version?: number): Promise<Blob> {
    const versionParam = version ? `?version=${version}` : '';
    const response = await apiClient.get(`/state/${project}/${stateName}${versionParam}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  static async getStates(project: string, stateName: string): Promise<StateVersionInfo[]> {
    const response = await apiClient.get(`/states/${project}/${stateName}`);
    return response.data;
  }

  static async putState(
    project: string,
    stateName: string,
    stateData: Blob | string,
    version?: number,
  ): Promise<void> {
    const versionParam = version ? `?version=${version}` : '';
    await apiClient.post(`/state/${project}/${stateName}${versionParam}`, stateData, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }

  static async deleteState(project: string, stateName: string, version?: number): Promise<void> {
    const versionParam = version ? `?version=${version}` : '';
    await apiClient.delete(`/state/${project}/${stateName}${versionParam}`);
  }

  static async lockState(
    project: string,
    stateName: string,
    lockInfo: Record<string, any> = {},
  ): Promise<void> {
    await apiClient.request({
      method: 'LOCK',
      url: `/state/${project}/${stateName}`,
      data: lockInfo,
    });
  }

  static async unlockState(
    project: string,
    stateName: string,
    lockInfo: Record<string, any> = {},
  ): Promise<void> {
    await apiClient.request({
      method: 'UNLOCK',
      url: `/state/${project}/${stateName}`,
      data: lockInfo,
    });
  }

  static async checkStateExists(project: string, stateName: string): Promise<boolean> {
    try {
      const versions = await this.getStates(project, stateName);
      return Array.isArray(versions) && versions.length > 0;
    } catch (error) {
      console.log('State does not exist:', error);
      return false;
    }
  }

  static async getStateAsJson(project: string, stateName: string, version?: number): Promise<any> {
    try {
      const blob = await this.getState(project, stateName, version);
      const text = await blob.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to get state as JSON:', error);
      throw error;
    }
  }

  static async getStateStatus(project: string, stateName: string): Promise<any> {
    const response = await apiClient.get(`/state/${project}/${stateName}/status`);
    return response.data;
  }
}
