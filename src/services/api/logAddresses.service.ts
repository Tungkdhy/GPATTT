import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockLogAddresses = [
  { id: 1, name: 'Main Log Server', address: '192.168.1.100', port: 514, protocol: 'UDP', type: 'Syslog', status: 'active', description: 'Server log chính' },
  { id: 2, name: 'Security Log Server', address: '192.168.1.101', port: 6514, protocol: 'TCP', type: 'Syslog-TLS', status: 'active', description: 'Log bảo mật encrypted' },
  { id: 3, name: 'Backup Log Server', address: '192.168.1.102', port: 514, protocol: 'UDP', type: 'Syslog', status: 'inactive', description: 'Server log dự phòng' },
  { id: 4, name: 'Cloud Log Service', address: 'logs.example.com', port: 443, protocol: 'HTTPS', type: 'API', status: 'active', description: 'Dịch vụ log trên cloud' },
  { id: 5, name: 'Local File System', address: '/var/log/security', port: 0, protocol: 'FILE', type: 'Local', status: 'active', description: 'Lưu log cục bộ' },
];

export interface LogAddress {
  id: number;
  name: string;
  address: string;
  port: number;
  protocol: string;
  type: string;
  status: string;
  description: string;
}

export interface CreateLogAddressDto {
  name: string;
  address: string;
  port: number;
  protocol: string;
  type: string;
  description: string;
}

export interface UpdateLogAddressDto {
  name?: string;
  address?: string;
  port?: number;
  protocol?: string;
  type?: string;
  description?: string;
}

class LogAddressesService {
  async getAll(): Promise<LogAddress[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOG_ADDRESSES.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockLogAddresses), 500);
      });
    } catch (error) {
      console.error('Error fetching log addresses:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<LogAddress> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.LOG_ADDRESSES.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const logAddress = mockLogAddresses.find(l => l.id === id);
          if (logAddress) {
            resolve(logAddress);
          } else {
            reject(new Error('Log address not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching log address:', error);
      throw error;
    }
  }

  async create(data: CreateLogAddressDto): Promise<LogAddress> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.LOG_ADDRESSES.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newLogAddress: LogAddress = {
            id: mockLogAddresses.length + 1,
            ...data,
            status: 'active'
          };
          resolve(newLogAddress);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating log address:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateLogAddressDto): Promise<LogAddress> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.LOG_ADDRESSES.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const logAddress = mockLogAddresses.find(l => l.id === id);
          if (logAddress) {
            const updatedLogAddress = { ...logAddress, ...data };
            resolve(updatedLogAddress);
          } else {
            reject(new Error('Log address not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating log address:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.LOG_ADDRESSES.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting log address:', error);
      throw error;
    }
  }
}

export default new LogAddressesService();
