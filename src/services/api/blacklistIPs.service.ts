import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockBlacklistIPs = [
  { id: 1, ipAddress: '192.168.100.50', reason: 'Multiple failed login attempts', source: 'Firewall', addedDate: '2024-01-15 10:30', expiryDate: '2024-02-15', status: 'active' },
  { id: 2, ipAddress: '10.0.50.100', reason: 'Malware detected', source: 'IDS', addedDate: '2024-01-14 15:20', expiryDate: '2024-03-14', status: 'active' },
  { id: 3, ipAddress: '172.16.0.99', reason: 'Port scanning activity', source: 'Security Log', addedDate: '2024-01-13 09:15', expiryDate: '2024-01-20', status: 'expired' },
  { id: 4, ipAddress: '203.0.113.45', reason: 'DDoS attack source', source: 'Network Monitor', addedDate: '2024-01-15 11:00', expiryDate: 'Permanent', status: 'active' },
];

export interface BlacklistIP {
  id: string;
  ip_public: string;
  ip_local: string;
  type: string;
  description: string;
  status: string;
  location: string;
  created_at: string;
  created_by_name: string;
  updated_by_name: string | null;
}

export interface CreateBlacklistIPDto {
  ip_public: string;
  ip_local: string;
  type: string;
  description: string;
  location: string;
}

export interface UpdateBlacklistIPDto {
  ip_public?: string;
  ip_local?: string;
  type?: string;
  description?: string;
  location?: string;
  status?: string;
}

class BlacklistIPsService {
  async getAll(page: number = 1, size: number = 10, params: any = {}): Promise<any> {
    try {
      const response = await axiosInstance.get('manager-ips', {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching blacklist IPs:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<BlacklistIP> {
    try {
      const response = await axiosInstance.get(`manager-ips/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching blacklist IP:', error);
      throw error;
    }
  }

  async create(data: CreateBlacklistIPDto): Promise<any> {
    try {
      const response = await axiosInstance.post('manager-ips', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating blacklist IP:', error);
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo IP manager';
      throw new Error(errorMessage);
    }
  }

  async update(id: string, data: UpdateBlacklistIPDto): Promise<any> {
    try {
      const response = await axiosInstance.put(`manager-ips/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating blacklist IP:', error);
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật IP manager';
      throw new Error(errorMessage);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`manager-ips/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting blacklist IP:', error);
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa IP manager';
      throw new Error(errorMessage);
    }
  }
}

export default new BlacklistIPsService();
