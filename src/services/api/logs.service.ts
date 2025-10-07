import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

export interface LogUser {
  display_name: string;
  user_name: string;
}

export interface LogType {
  id: string;
  display_name: string;
  value: string;
}

export interface Log {
  id: string;
  user_id: string;
  action_name: string;
  description: string;
  is_active: boolean;
  log_type_id: string;
  created_at: string;
  user: LogUser;
  log_type: LogType;
}

export interface LogsResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: Log[];
  };
}

export interface LogsParams {
  type?: number;
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  logType?: string;
  actionName?: string;
  userId?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

class LogsService {
  async getAll(params: LogsParams = {}): Promise<LogsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.type !== undefined) queryParams.append('type', params.type.toString());
      if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
      if (params.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.logType) queryParams.append('logType', params.logType);
      if (params.actionName) queryParams.append('actionName', params.actionName);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await axiosInstance.get(`${API_ENDPOINTS.LOGS.LIST}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Log> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOGS.GET(id));
      return response.data.data;
    } catch (error) {
      console.error('Error fetching log by id:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.LOGS.DELETE(id));
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }

  async getLogTypes(): Promise<LogType[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOG_TYPES.LIST);
      return response.data.data || response.data.rows || response.data;
    } catch (error) {
      console.error('Error fetching log types:', error);
      throw error;
    }
  }
}

export const logsService = new LogsService();