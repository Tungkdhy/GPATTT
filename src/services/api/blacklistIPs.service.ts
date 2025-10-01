import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockBlacklistIPs = [
  { id: 1, ipAddress: '192.168.100.50', reason: 'Multiple failed login attempts', source: 'Firewall', addedDate: '2024-01-15 10:30', expiryDate: '2024-02-15', status: 'active' },
  { id: 2, ipAddress: '10.0.50.100', reason: 'Malware detected', source: 'IDS', addedDate: '2024-01-14 15:20', expiryDate: '2024-03-14', status: 'active' },
  { id: 3, ipAddress: '172.16.0.99', reason: 'Port scanning activity', source: 'Security Log', addedDate: '2024-01-13 09:15', expiryDate: '2024-01-20', status: 'expired' },
  { id: 4, ipAddress: '203.0.113.45', reason: 'DDoS attack source', source: 'Network Monitor', addedDate: '2024-01-15 11:00', expiryDate: 'Permanent', status: 'active' },
];

export interface BlacklistIP {
  id: number;
  ipAddress: string;
  reason: string;
  source: string;
  addedDate: string;
  expiryDate: string;
  status: string;
}

export interface CreateBlacklistIPDto {
  ipAddress: string;
  reason: string;
  source: string;
  expiryDate: string;
}

export interface UpdateBlacklistIPDto {
  ipAddress?: string;
  reason?: string;
  source?: string;
  expiryDate?: string;
  status?: string;
}

class BlacklistIPsService {
  async getAll(): Promise<BlacklistIP[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.BLACKLIST_IPS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBlacklistIPs), 500);
      });
    } catch (error) {
      console.error('Error fetching blacklist IPs:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<BlacklistIP> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.BLACKLIST_IPS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const ip = mockBlacklistIPs.find(i => i.id === id);
          if (ip) {
            resolve(ip);
          } else {
            reject(new Error('Blacklist IP not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching blacklist IP:', error);
      throw error;
    }
  }

  async create(data: CreateBlacklistIPDto): Promise<BlacklistIP> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.BLACKLIST_IPS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newIP: BlacklistIP = {
            id: mockBlacklistIPs.length + 1,
            ...data,
            addedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: 'active'
          };
          resolve(newIP);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating blacklist IP:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateBlacklistIPDto): Promise<BlacklistIP> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.BLACKLIST_IPS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const ip = mockBlacklistIPs.find(i => i.id === id);
          if (ip) {
            const updatedIP = { ...ip, ...data };
            resolve(updatedIP);
          } else {
            reject(new Error('Blacklist IP not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating blacklist IP:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.BLACKLIST_IPS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting blacklist IP:', error);
      throw error;
    }
  }
}

export default new BlacklistIPsService();
