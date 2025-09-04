import { apiClient } from './client';
import { AuditLog } from '../types/buisness';

export interface AuditFilters {
  user_id?: string;
  resource_type?: string;
  resource_id?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export class AuditService {
  static async getAuditLogs(filters?: AuditFilters): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/audit${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  }

  static async getAuditLog(id: string): Promise<AuditLog> {
    const response = await apiClient.get(`/audit/${id}`);
    return response.data;
  }

  static async getUserAuditLogs(userId: string, filters?: Omit<AuditFilters, 'user_id'>): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/users/${userId}/audit${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  }

  static async getResourceAuditLogs(resourceType: string, resourceId: string, filters?: Omit<AuditFilters, 'resource_type' | 'resource_id'>): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/audit/${resourceType}/${resourceId}${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  }

  static async createAuditLog(auditLog: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const response = await apiClient.post('/audit', auditLog);
    return response.data;
  }
}
