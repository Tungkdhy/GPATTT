import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockLogs = [
  { id: 1, timestamp: '2024-01-15 12:30:45', source: 'Firewall-Main', type: 'Security', level: 'critical', message: 'Unauthorized access attempt detected', ip: '203.0.113.45' },
  { id: 2, timestamp: '2024-01-15 12:28:30', source: 'Server-001', type: 'System', level: 'warning', message: 'High CPU usage detected (85%)', ip: '192.168.1.10' },
  { id: 3, timestamp: '2024-01-15 12:25:15', source: 'Switch-Core', type: 'Network', level: 'info', message: 'Port 24 link up', ip: '192.168.1.5' },
  { id: 4, timestamp: '2024-01-15 12:20:00', source: 'IDS-001', type: 'Security', level: 'high', message: 'Port scanning detected', ip: '172.16.0.99' },
  { id: 5, timestamp: '2024-01-15 12:15:30', source: 'WebApp-01', type: 'Application', level: 'error', message: 'Database connection failed', ip: '192.168.1.50' },
];

export interface Log {
  id: number;
  timestamp: string;
  source: string;
  type: string;
  level: string;
  message: string;
  ip: string;
}

export interface CreateLogDto {
  source: string;
  type: string;
  level: string;
  message: string;
  ip: string;
}

export interface UpdateLogDto {
  source?: string;
  type?: string;
  level?: string;
  message?: string;
  ip?: string;
}

class LogsService {
  async getAll(): Promise<Log[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOGS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockLogs), 500);
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Log> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOGS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const log = mockLogs.find(l => l.id === id);
          if (log) {
            resolve(log);
          } else {
            reject(new Error('Log not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching log:', error);
      throw error;
    }
  }

  async create(data: CreateLogDto): Promise<Log> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.LOGS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newLog: Log = {
            id: mockLogs.length + 1,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            ...data
          };
          resolve(newLog);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateLogDto): Promise<Log> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.LOGS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const log = mockLogs.find(l => l.id === id);
          if (log) {
            const updatedLog = { ...log, ...data };
            resolve(updatedLog);
          } else {
            reject(new Error('Log not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.LOGS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }
}

export default new LogsService();
