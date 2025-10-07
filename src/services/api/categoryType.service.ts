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

class CategoyTypeService {
  // Lấy danh sách users
  async getAll(page: number = 1, size: number = 10000,params={}): Promise<any> {
    try {
      const res = await axiosInstance.get("category-types", {
        params:{
          pageSize:size,
          pageIndex:page,
          ...params
        }
      })
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
      // return response.data;

      // Mock response
      return res.data.data
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Lấy thông tin user theo ID
  async getById(id: number): Promise<User> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.GET(id));
      // return response.data;

      // Mock response
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find(u => u.id === id);
          if (user) {
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Tạo user mới
  async create(data: any): Promise<any> {
    try {
      const res = await axiosInstance.post("category-types",{
        ...data,
      //  category_type_id: '4fd60a31-f06f-4ddb-ad16-4c85f0f4480a'
      })
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      return res
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  async update(id: number, data: any): Promise<any> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
      // return response.data;

      // Mock response
        const res = await axiosInstance.put(`category-types/${id}`,{
        ...data,
        // category_type_id: '4fd60a31-f06f-4ddb-ad16-4c85f0f4480a'
      })
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      return res
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  async delete(id: number): Promise<any> {
    try {
       const res = await axiosInstance.delete(`category-types/${id}`)
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      return res
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new CategoyTypeService();
