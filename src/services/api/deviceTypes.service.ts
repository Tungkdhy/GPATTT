import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockDeviceTypes = [
  { 
    id: 1, 
    name: 'Server', 
    category: 'Infrastructure', 
    manufacturer: 'Various', 
    monitoring: 'enabled',
    ports: '22,80,443,3389',
    description: 'Máy chủ vật lý hoặc ảo hóa',
    specifications: 'CPU, RAM, Storage monitoring'
  },
  { 
    id: 2, 
    name: 'Firewall', 
    category: 'Security', 
    manufacturer: 'Fortinet, Cisco', 
    monitoring: 'enabled',
    ports: '443,8080',
    description: 'Thiết bị tường lửa bảo mật mạng',
    specifications: 'Throughput, Connection tracking'
  },
  { 
    id: 3, 
    name: 'Switch', 
    category: 'Network', 
    manufacturer: 'Cisco, HP', 
    monitoring: 'enabled',
    ports: '23,80,161',
    description: 'Thiết bị chuyển mạch Layer 2/3',
    specifications: 'Port status, VLAN, Bandwidth'
  },
  { 
    id: 4, 
    name: 'Router', 
    category: 'Network', 
    manufacturer: 'Cisco, Juniper', 
    monitoring: 'enabled',
    ports: '22,23,80,161',
    description: 'Thiết bị định tuyến mạng',
    specifications: 'Routing table, Interface status'
  },
  { 
    id: 5, 
    name: 'Workstation', 
    category: 'Endpoint', 
    manufacturer: 'Dell, HP, Lenovo', 
    monitoring: 'disabled',
    ports: '3389,5900',
    description: 'Máy tính làm việc của người dùng',
    specifications: 'OS version, Antivirus status'
  },
  { 
    id: 6, 
    name: 'IP Camera', 
    category: 'IoT', 
    manufacturer: 'Hikvision, Dahua', 
    monitoring: 'enabled',
    ports: '80,554,8000',
    description: 'Camera IP giám sát',
    specifications: 'Video stream, Motion detection'
  }
];

export interface DeviceType {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  monitoring: string;
  ports: string;
  description: string;
  specifications: string;
}

export interface CreateDeviceTypeDto {
  name: string;
  category: string;
  manufacturer: string;
  monitoring: string;
  ports: string;
  description: string;
  specifications: string;
}

export interface UpdateDeviceTypeDto {
  name?: string;
  category?: string;
  manufacturer?: string;
  monitoring?: string;
  ports?: string;
  description?: string;
  specifications?: string;
}

class DeviceTypesService {
  async getAll(): Promise<DeviceType[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.DEVICE_TYPES.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockDeviceTypes), 500);
      });
    } catch (error) {
      console.error('Error fetching device types:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<DeviceType> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.DEVICE_TYPES.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const deviceType = mockDeviceTypes.find(d => d.id === id);
          if (deviceType) {
            resolve(deviceType);
          } else {
            reject(new Error('Device type not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching device type:', error);
      throw error;
    }
  }

  async create(data: CreateDeviceTypeDto): Promise<DeviceType> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.DEVICE_TYPES.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDeviceType: DeviceType = {
            id: mockDeviceTypes.length + 1,
            ...data
          };
          resolve(newDeviceType);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating device type:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateDeviceTypeDto): Promise<DeviceType> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.DEVICE_TYPES.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const deviceType = mockDeviceTypes.find(d => d.id === id);
          if (deviceType) {
            const updatedDeviceType = { ...deviceType, ...data };
            resolve(updatedDeviceType);
          } else {
            reject(new Error('Device type not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating device type:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.DEVICE_TYPES.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting device type:', error);
      throw error;
    }
  }
}

export default new DeviceTypesService();
