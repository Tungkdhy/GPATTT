import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockVersions = [
  { id: 1, name: 'Security Agent', version: '2.1.0', type: 'Agent', status: 'stable', releaseDate: '2024-01-15', description: 'Phiên bản ổn định với cải tiến bảo mật' },
  { id: 2, name: 'Firewall Manager', version: '1.5.2', type: 'Manager', status: 'beta', releaseDate: '2024-01-10', description: 'Phiên bản beta với tính năng mới' },
  { id: 3, name: 'Log Collector', version: '3.0.1', type: 'Service', status: 'deprecated', releaseDate: '2023-12-20', description: 'Phiên bản cũ, sẽ ngừng hỗ trợ' },
  { id: 4, name: 'Network Monitor', version: '1.2.5', type: 'Monitor', status: 'stable', releaseDate: '2024-01-05', description: 'Phiên bản ổn định cho giám sát mạng' },
  { id: 5, name: 'Threat Detection', version: '4.0.0', type: 'Engine', status: 'stable', releaseDate: '2024-01-12', description: 'Phiên bản mới với AI detection' },
];

export interface SoftwareVersion {
  id: number;
  name: string;
  version: string;
  type: string;
  status: string;
  releaseDate: string;
  description: string;
}

export interface CreateSoftwareVersionDto {
  name: string;
  version: string;
  type: string;
  status: string;
  releaseDate: string;
  description: string;
}

export interface UpdateSoftwareVersionDto {
  name?: string;
  version?: string;
  type?: string;
  status?: string;
  releaseDate?: string;
  description?: string;
}

class SoftwareVersionsService {
  async getAll(): Promise<SoftwareVersion[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.SOFTWARE_VERSIONS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockVersions), 500);
      });
    } catch (error) {
      console.error('Error fetching software versions:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<SoftwareVersion> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.SOFTWARE_VERSIONS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const version = mockVersions.find(v => v.id === id);
          if (version) {
            resolve(version);
          } else {
            reject(new Error('Software version not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching software version:', error);
      throw error;
    }
  }

  async create(data: CreateSoftwareVersionDto): Promise<SoftwareVersion> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.SOFTWARE_VERSIONS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newVersion: SoftwareVersion = {
            id: mockVersions.length + 1,
            ...data
          };
          resolve(newVersion);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating software version:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateSoftwareVersionDto): Promise<SoftwareVersion> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.SOFTWARE_VERSIONS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const version = mockVersions.find(v => v.id === id);
          if (version) {
            const updatedVersion = { ...version, ...data };
            resolve(updatedVersion);
          } else {
            reject(new Error('Software version not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating software version:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.SOFTWARE_VERSIONS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting software version:', error);
      throw error;
    }
  }
}

export default new SoftwareVersionsService();
