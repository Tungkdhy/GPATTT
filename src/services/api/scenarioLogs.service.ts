import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

const mockScenarioLogs = [
  { id: 1, scenario: 'Phát hiện mã độc', timestamp: '2024-01-15 12:30:00', device: 'Server-001', status: 'detected', severity: 'critical', details: 'Trojan.Win32.Generic detected' },
  { id: 2, scenario: 'Tấn công DDoS', timestamp: '2024-01-15 12:25:00', device: 'Firewall-Main', status: 'blocked', severity: 'high', details: 'DDoS attack blocked from 203.0.113.45' },
  { id: 3, scenario: 'Login bất thường', timestamp: '2024-01-15 12:20:00', device: 'Server-002', status: 'investigating', severity: 'medium', details: 'Multiple failed login attempts' },
  { id: 4, scenario: 'Sử dụng tài nguyên cao', timestamp: '2024-01-15 12:15:00', device: 'Server-001', status: 'resolved', severity: 'low', details: 'CPU usage normalized' },
];

export interface ScenarioLog {
  id: number;
  scenario: string;
  timestamp: string;
  device: string;
  status: string;
  severity: string;
  details: string;
}

export interface CreateScenarioLogDto {
  scenario: string;
  device: string;
  status: string;
  severity: string;
  details: string;
}

export interface UpdateScenarioLogDto {
  scenario?: string;
  device?: string;
  status?: string;
  severity?: string;
  details?: string;
}

class ScenarioLogsService {
  async getAll(): Promise<ScenarioLog[]> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockScenarioLogs), 500);
      });
    } catch (error) {
      console.error('Error fetching scenario logs:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<ScenarioLog> {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const log = mockScenarioLogs.find(l => l.id === id);
          if (log) {
            resolve(log);
          } else {
            reject(new Error('Scenario log not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching scenario log:', error);
      throw error;
    }
  }

  async create(data: CreateScenarioLogDto): Promise<ScenarioLog> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newLog: ScenarioLog = {
            id: mockScenarioLogs.length + 1,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            ...data
          };
          resolve(newLog);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating scenario log:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateScenarioLogDto): Promise<ScenarioLog> {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const log = mockScenarioLogs.find(l => l.id === id);
          if (log) {
            const updatedLog = { ...log, ...data };
            resolve(updatedLog);
          } else {
            reject(new Error('Scenario log not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating scenario log:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting scenario log:', error);
      throw error;
    }
  }
}

export default new ScenarioLogsService();
