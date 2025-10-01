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

class UsersService {
  // Lấy danh sách users
  async getAll(): Promise<User[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
      // return response.data;
      
      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockUsers), 500);
      });
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
  async create(data: CreateUserDto): Promise<User> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;
      
      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: mockUsers.length + 1,
            username: data.username,
            email: data.email,
            role: data.role,
            status: 'active',
            lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          resolve(newUser);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  async update(id: number, data: UpdateUserDto): Promise<User> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
      // return response.data;
      
      // Mock response
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find(u => u.id === id);
          if (user) {
            const updatedUser = { ...user, ...data };
            resolve(updatedUser);
          } else {
            reject(new Error('User not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  async delete(id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
      
      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new UsersService();
