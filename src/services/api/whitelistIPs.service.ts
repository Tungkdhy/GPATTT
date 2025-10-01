import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockWhitelistIPs = [
  { id: 1, ipAddress: '192.168.1.100', description: 'Admin workstation', owner: 'IT Department', addedDate: '2024-01-10 10:00', expiryDate: 'Permanent', status: 'active' },
  { id: 2, ipAddress: '10.0.1.50', description: 'Security scanner', owner: 'Security Team', addedDate: '2024-01-12 14:30', expiryDate: '2024-12-31', status: 'active' },
  { id: 3, ipAddress: '172.16.10.20', description: 'Backup server', owner: 'Operations', addedDate: '2024-01-08 09:00', expiryDate: 'Permanent', status: 'active' },
  { id: 4, ipAddress: '192.168.50.5', description: 'VPN gateway', owner: 'Network Team', addedDate: '2024-01-05 11:15', expiryDate: '2024-06-30', status: 'active' },
];

export interface WhitelistIP {
  id: number;
  ipAddress: string;
  description: string;
  owner: string;
  addedDate: string;
  expiryDate: string;
  status: string;
}

export interface CreateWhitelistIPDto {
  ipAddress: string;
  description: string;
  owner: string;
  expiryDate: string;
}

export interface UpdateWhitelistIPDto {
  ipAddress?: string;
  description?: string;
  owner?: string;
  expiryDate?: string;
  status?: string;
}

class WhitelistIPsService {
  async getAll(): Promise<WhitelistIP[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.WHITELIST_IPS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockWhitelistIPs), 500);
      });
    } catch (error) {
      console.error('Error fetching whitelist IPs:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<WhitelistIP> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.WHITELIST_IPS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const ip = mockWhitelistIPs.find(i => i.id === id);
          if (ip) {
            resolve(ip);
          } else {
            reject(new Error('Whitelist IP not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching whitelist IP:', error);
      throw error;
    }
  }

  async create(data: CreateWhitelistIPDto): Promise<WhitelistIP> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.WHITELIST_IPS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newIP: WhitelistIP = {
            id: mockWhitelistIPs.length + 1,
            ...data,
            addedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: 'active'
          };
          resolve(newIP);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating whitelist IP:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateWhitelistIPDto): Promise<WhitelistIP> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.WHITELIST_IPS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const ip = mockWhitelistIPs.find(i => i.id === id);
          if (ip) {
            const updatedIP = { ...ip, ...data };
            resolve(updatedIP);
          } else {
            reject(new Error('Whitelist IP not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating whitelist IP:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.WHITELIST_IPS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting whitelist IP:', error);
      throw error;
    }
  }
}

export default new WhitelistIPsService();
