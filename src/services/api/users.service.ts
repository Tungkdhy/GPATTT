import axiosInstance from './axiosInstance';

// Mock data removed as it's not being used

export interface UserRole {
  id: string;
  display_name: string;
  description: string;
  code: string;
}

export interface UserOrganization {
  organization_name: string;
}

export interface UserUnit {
  unit_name: string;
}

export interface User {
  id: string;
  user_name: string;
  display_name: string;
  email: string | null;
  phone_number: string | null;
  is_online: boolean | null;
  is_active: boolean;
  organization_id: string | null;
  unit_id: string | null;
  created_at: string;
  created_by: string | null;
  role: UserRole;
  organization: UserOrganization | null;
  unit: UserUnit | null;
}

export interface CreateUserDto {
  user_name: string;
  display_name: string;
  role_id: string;
  password: string;
}

export interface UpdateUserDto {
  user_name?: string;
  display_name?: string;
  role_id?: string;
  password?: string;
  is_active?: boolean;
}

class UsersService {
  // Lấy danh sách users
  async getAll(page: number = 1, size: number = 10,params={}): Promise<any> {
    try {
      const res = await axiosInstance.get("user", {
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
  async getById(id: string): Promise<User> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.USERS.GET(id));
      // return response.data;

      // Mock response - return a mock user with the new structure
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser: User = {
            id: id,
            user_name: 'mock_user',
            display_name: 'Mock User',
            email: 'mock@example.com',
            phone_number: null,
            is_online: true,
            is_active: true,
            organization_id: null,
            unit_id: null,
            created_at: new Date().toISOString(),
            created_by: null,
            role: {
              id: '1',
              display_name: 'Admin',
              description: 'Administrator',
              code: 'ADMIN'
            },
            organization: null,
            unit: null
          };
          resolve(mockUser);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Tạo user mới
  async create(data: CreateUserDto): Promise<any> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data);
      // return response.data;

      // Mock response
      const res = axiosInstance.post("user",{
        ...data
      })
      return res
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  async update(id: string, data: UpdateUserDto): Promise<any> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), data);
      // return response.data;

      // Mock response
      const res = await axiosInstance.put(`user/${id}`,data)
      return res
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  async delete(id: string): Promise<any> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
      const res = await axiosInstance.delete(`user/${id}`)
      // Mock response
      return res
     
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Toggle trạng thái is_active
  async toggleActive(id: string, isActive: boolean): Promise<any> {
    try {
      const res = await axiosInstance.put(`user/${id}`, {
        is_active: isActive
      });
      return res;
    } catch (error) {
      console.error('Error toggling user active status:', error);
      throw error;
    }
  }
}

export default new UsersService();
