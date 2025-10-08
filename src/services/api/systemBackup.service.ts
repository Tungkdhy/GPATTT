import axiosInstance  from './axiosInstance';

export interface SystemBackup {
  id: string;
  name: string;
  type: number;
  path: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  created_by_user: {
    id: string;
    display_name: string;
  } | null;
}

export interface SystemBackupResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: SystemBackup[];
  };
}

export interface RestoreBackupParams {
  type?: number;
  pageSize?: number;
  pageIndex?: number;
}

export interface UpdateBackupDto {
  name: string;
  type: number;
}

class SystemBackupService {
  private baseUrl = '/restore-backup';

  async getAll(params?: RestoreBackupParams): Promise<SystemBackupResponse> {
    try {
      const response = await axiosInstance.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching system backups:', error);
      throw error;
    }
  }

  async restoreBackup(backupId: string): Promise<any> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/restore/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  async createBackup(): Promise<any> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/backup`);
      return response.data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async updateBackup(backupId: string, updateData: UpdateBackupDto): Promise<any> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${backupId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating backup:', error);
      throw error;
    }
  }

  async deleteBackup(backupId: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  async getBackupDetails(backupId: string): Promise<SystemBackup> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${backupId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching backup details:', error);
      throw error;
    }
  }

  async clearSystem(): Promise<any> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/clear-system`);
      return response.data;
    } catch (error) {
      console.error('Error clearing system:', error);
      throw error;
    }
  }
}

export const systemBackupService = new SystemBackupService();
