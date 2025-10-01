import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

const mockAlertLevels = [
  { id: 1, name: 'Critical', code: 'CRIT', color: '#dc2626', priority: 1, notification: 'Immediate', escalation: 'Auto', description: 'Requires immediate action' },
  { id: 2, name: 'High', code: 'HIGH', color: '#ea580c', priority: 2, notification: 'Urgent', escalation: '15 mins', description: 'High priority issues' },
  { id: 3, name: 'Medium', code: 'MED', color: '#f59e0b', priority: 3, notification: 'Standard', escalation: '1 hour', description: 'Medium priority warnings' },
  { id: 4, name: 'Low', code: 'LOW', color: '#3b82f6', priority: 4, notification: 'Standard', escalation: '4 hours', description: 'Low priority informational' },
  { id: 5, name: 'Info', code: 'INFO', color: '#10b981', priority: 5, notification: 'None', escalation: 'None', description: 'Informational only' },
];

export interface AlertLevel {
  id: number;
  name: string;
  code: string;
  color: string;
  priority: number;
  notification: string;
  escalation: string;
  description: string;
}

export interface CreateAlertLevelDto {
  name: string;
  code: string;
  color: string;
  priority: number;
  notification: string;
  escalation: string;
  description: string;
}

export interface UpdateAlertLevelDto {
  name?: string;
  code?: string;
  color?: string;
  priority?: number;
  notification?: string;
  escalation?: string;
  description?: string;
}

class AlertLevelsService {
  async getAll(): Promise<AlertLevel[]> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockAlertLevels), 500);
      });
    } catch (error) {
      console.error('Error fetching alert levels:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<AlertLevel> {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const level = mockAlertLevels.find(l => l.id === id);
          if (level) {
            resolve(level);
          } else {
            reject(new Error('Alert level not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching alert level:', error);
      throw error;
    }
  }

  async create(data: CreateAlertLevelDto): Promise<AlertLevel> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newLevel: AlertLevel = {
            id: mockAlertLevels.length + 1,
            ...data
          };
          resolve(newLevel);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating alert level:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateAlertLevelDto): Promise<AlertLevel> {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const level = mockAlertLevels.find(l => l.id === id);
          if (level) {
            const updatedLevel = { ...level, ...data };
            resolve(updatedLevel);
          } else {
            reject(new Error('Alert level not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating alert level:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting alert level:', error);
      throw error;
    }
  }
}

export default new AlertLevelsService();
