import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockLogTypes = [
  { id: 1, name: 'Security', code: 'SEC', category: 'Security', severity: 'high', retention: '365 days', description: 'Security-related logs' },
  { id: 2, name: 'System', code: 'SYS', category: 'System', severity: 'medium', retention: '180 days', description: 'System events and errors' },
  { id: 3, name: 'Network', code: 'NET', category: 'Network', severity: 'medium', retention: '90 days', description: 'Network traffic logs' },
  { id: 4, name: 'Application', code: 'APP', category: 'Application', severity: 'low', retention: '90 days', description: 'Application-level logs' },
  { id: 5, name: 'Audit', code: 'AUD', category: 'Audit', severity: 'high', retention: '730 days', description: 'Audit trail logs' },
];

export interface LogType {
  id: number;
  name: string;
  code: string;
  category: string;
  severity: string;
  retention: string;
  description: string;
}

export interface CreateLogTypeDto {
  name: string;
  code: string;
  category: string;
  severity: string;
  retention: string;
  description: string;
}

export interface UpdateLogTypeDto {
  name?: string;
  code?: string;
  category?: string;
  severity?: string;
  retention?: string;
  description?: string;
}

class LogTypesService {
  async getAll(): Promise<LogType[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOG_TYPES.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockLogTypes), 500);
      });
    } catch (error) {
      console.error('Error fetching log types:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<LogType> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOG_TYPES.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const logType = mockLogTypes.find(l => l.id === id);
          if (logType) {
            resolve(logType);
          } else {
            reject(new Error('Log type not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching log type:', error);
      throw error;
    }
  }

  async create(data: CreateLogTypeDto): Promise<LogType> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.LOG_TYPES.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newLogType: LogType = {
            id: mockLogTypes.length + 1,
            ...data
          };
          resolve(newLogType);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating log type:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateLogTypeDto): Promise<LogType> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.LOG_TYPES.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const logType = mockLogTypes.find(l => l.id === id);
          if (logType) {
            const updatedLogType = { ...logType, ...data };
            resolve(updatedLogType);
          } else {
            reject(new Error('Log type not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating log type:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.LOG_TYPES.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting log type:', error);
      throw error;
    }
  }
}

export default new LogTypesService();
