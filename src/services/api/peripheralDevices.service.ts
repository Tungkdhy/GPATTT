import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

export interface PeripheralDevice {
  id: string;
  display_name: string;
  value: string;
  description: string;
  category_type_id: string;
  created_by_user?: {
    display_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreatePeripheralDeviceDto {
  display_name: string;
  value: string;
  description: string;
  category_type_id: string;
}

export interface UpdatePeripheralDeviceDto {
  display_name?: string;
  value?: string;
  description?: string;
  category_type_id?: string;
}

export interface PeripheralDevicesResponse {
  rows: PeripheralDevice[];
  total: number;
  count: number; // Add count property for useServerPagination compatibility
  page: number;
  pageSize: number;
  totalPages: number;
}

class PeripheralDevicesService {
  // Lấy danh sách peripheral devices
  async getAll(page: number = 1, size: number = 10000, params = {}): Promise<PeripheralDevice[]> {
    try {
      const res = await axiosInstance.get("category", {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      });
      return res.data.data.rows;
    } catch (error) {
      console.error('Error fetching peripheral devices:', error);
      throw error;
    }
  }

  async getAllFormat(page: number = 1, size: number = 10000, params = {}): Promise<PeripheralDevicesResponse> {
    try {
      const res = await axiosInstance.get("category", {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      });
      const data = res.data.data;
      // Ensure count property exists for useServerPagination compatibility
      return {
        ...data,
        count: data.total
      };
    } catch (error) {
      console.error('Error fetching peripheral devices:', error);
      throw error;
    }
  }

  // Lấy thông tin peripheral device theo ID
  async getById(id: string): Promise<PeripheralDevice> {
    try {
      const res = await axiosInstance.get(`category/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching peripheral device:', error);
      throw error;
    }
  }

  // Tạo peripheral device mới
  async create(data: CreatePeripheralDeviceDto): Promise<any> {
    try {
      const res = await axiosInstance.post("category", {
        ...data
      });
      return res;
    } catch (error) {
      console.error('Error creating peripheral device:', error);
      throw error;
    }
  }

  // Cập nhật peripheral device
  async update(id: string, data: UpdatePeripheralDeviceDto): Promise<any> {
    try {
      console.log('PeripheralDevicesService: Updating peripheral device with ID:', id);
      const res = await axiosInstance.put(`category/${id}`, {
        ...data
      });
      return res;
    } catch (error) {
      console.error('Error updating peripheral device:', error);
      throw error;
    }
  }

  // Xóa peripheral device
  async delete(id: string): Promise<any> {
    try {
      console.log('PeripheralDevicesService: Deleting peripheral device with ID:', id);
      const res = await axiosInstance.delete(`category/${id}`);
      return res;
    } catch (error) {
      console.error('Error deleting peripheral device:', error);
      throw error;
    }
  }
}

export default new PeripheralDevicesService();
