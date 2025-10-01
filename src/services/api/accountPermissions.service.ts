import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockPermissions = [
  { id: 1, username: 'admin', role: 'Admin', permissions: 'Full Access', modules: 'All Modules', status: 'active', lastModified: '2024-01-15 10:30' },
  { id: 2, username: 'operator1', role: 'Operator', permissions: 'Read/Write', modules: 'Devices, Logs, Scenarios', status: 'active', lastModified: '2024-01-14 15:20' },
  { id: 3, username: 'viewer1', role: 'Viewer', permissions: 'Read Only', modules: 'Dashboard, Reports', status: 'active', lastModified: '2024-01-13 09:15' },
  { id: 4, username: 'security', role: 'Security', permissions: 'Read/Write', modules: 'Security, Firewall, Threats', status: 'active', lastModified: '2024-01-15 11:00' },
];

export interface AccountPermission {
  id: number;
  username: string;
  role: string;
  permissions: string;
  modules: string;
  status: string;
  lastModified: string;
}

export interface CreateAccountPermissionDto {
  username: string;
  role: string;
  permissions: string;
  modules: string;
}

export interface UpdateAccountPermissionDto {
  username?: string;
  role?: string;
  permissions?: string;
  modules?: string;
  status?: string;
}

class AccountPermissionsService {
  async getAll(): Promise<AccountPermission[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT_PERMISSIONS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockPermissions), 500);
      });
    } catch (error) {
      console.error('Error fetching account permissions:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<AccountPermission> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT_PERMISSIONS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const permission = mockPermissions.find(p => p.id === id);
          if (permission) {
            resolve(permission);
          } else {
            reject(new Error('Permission not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching account permission:', error);
      throw error;
    }
  }

  async create(data: CreateAccountPermissionDto): Promise<AccountPermission> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.ACCOUNT_PERMISSIONS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPermission: AccountPermission = {
            id: mockPermissions.length + 1,
            ...data,
            status: 'active',
            lastModified: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          resolve(newPermission);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating account permission:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateAccountPermissionDto): Promise<AccountPermission> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.ACCOUNT_PERMISSIONS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const permission = mockPermissions.find(p => p.id === id);
          if (permission) {
            const updatedPermission = { 
              ...permission, 
              ...data,
              lastModified: new Date().toISOString().slice(0, 16).replace('T', ' ')
            };
            resolve(updatedPermission);
          } else {
            reject(new Error('Permission not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating account permission:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.ACCOUNT_PERMISSIONS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting account permission:', error);
      throw error;
    }
  }
}

export default new AccountPermissionsService();
