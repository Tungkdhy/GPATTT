import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15 10:30' },
  { id: 2, username: 'operator1', email: 'operator1@example.com', role: 'Operator', status: 'active', lastLogin: '2024-01-15 09:15' },
  { id: 3, username: 'viewer1', email: 'viewer1@example.com', role: 'Viewer', status: 'inactive', lastLogin: '2024-01-10 14:20' },
  { id: 4, username: 'security', email: 'security@example.com', role: 'Security', status: 'active', lastLogin: '2024-01-15 11:45' },
];

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  password?: string;
}

class RoleService {
  // Lấy danh sách users
  async getAll(page: number = 1, size: number = 10000, params = {}): Promise<any> {
    try {
      const res = await axiosInstance.get("role", {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      })
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
      // return response.data;

      // Mock response
      return res.data.data.roles
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Lấy thông tin user theo ID
  async getById(id: number): Promise<any> {
    try {
      const res = await axiosInstance.get(`/roles-actions/${id}`)
      return res.data.data
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.GET(id));
      // return response.data;

      // Mock response

    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Tạo user mới
  async create(data: any): Promise<any> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      const res = axiosInstance.post("role", {
        ...data,
        code: data.display_name
      })
      return res
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async createAction(data: any): Promise<any> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      const res = axiosInstance.post("roles-actions", {
        roleId: data.id,
        actionIds: data.actionIds
      })
      return res
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  // /roles-actions/{{role_id}}/actions
  // Cập nhật user
  async update(id: number | string, data: any): Promise<any> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
      // return response.data;
      const res = await axiosInstance.put(`role/${id}`, {
        ...data,
        code: data.display_name
      })
      return res
      // Mock response

    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  async updateRoleAction(id: number | string, data: any): Promise<any> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
      // return response.data;
      const res = await axiosInstance.put(`roles-actions/${id}/actions`, {
        roleId: data.id,
        actionIds: data.actionIds
      })
      return res
      // Mock response

    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  // Xóa user
  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
      const res = await axiosInstance.delete(`role/${id}`)
      // Mock response
      // return res

    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new RoleService();
