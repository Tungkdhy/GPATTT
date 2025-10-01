import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockDevices = [
  { id: 1, name: 'Server-001', type: 'Server', ip: '192.168.1.10', status: 'online', location: 'Datacenter A', lastSeen: '2024-01-15 12:30' },
  { id: 2, name: 'Firewall-Main', type: 'Firewall', ip: '192.168.1.1', status: 'online', location: 'Network Room', lastSeen: '2024-01-15 12:29' },
  { id: 3, name: 'Switch-Core', type: 'Switch', ip: '192.168.1.5', status: 'offline', location: 'Network Room', lastSeen: '2024-01-15 10:15' },
  { id: 4, name: 'Workstation-01', type: 'Workstation', ip: '192.168.1.50', status: 'online', location: 'Office Floor 1', lastSeen: '2024-01-15 12:25' },
  { id: 5, name: 'Router-Gateway', type: 'Router', ip: '192.168.1.254', status: 'warning', location: 'Network Room', lastSeen: '2024-01-15 12:20' },
];

export interface Device {
  id: number;
  name: string;
  type: string;
  ip: string;
  status: string;
  location: string;
  lastSeen: string;
}

export interface CreateDeviceDto {
  name: string;
  type: string;
  ip: string;
  location: string;
}

export interface UpdateDeviceDto {
  name?: string;
  type?: string;
  ip?: string;
  location?: string;
}

class DevicesService {
  async getAll(): Promise<Device[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.DEVICES.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockDevices), 500);
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Device> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.DEVICES.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const device = mockDevices.find(d => d.id === id);
          if (device) {
            resolve(device);
          } else {
            reject(new Error('Device not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching device:', error);
      throw error;
    }
  }

  async create(data: CreateDeviceDto): Promise<Device> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.DEVICES.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDevice: Device = {
            id: mockDevices.length + 1,
            ...data,
            status: 'online',
            lastSeen: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          resolve(newDevice);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateDeviceDto): Promise<Device> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.DEVICES.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const device = mockDevices.find(d => d.id === id);
          if (device) {
            const updatedDevice = { ...device, ...data };
            resolve(updatedDevice);
          } else {
            reject(new Error('Device not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.DEVICES.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }
}

export default new DevicesService();
