import axiosInstance from './axiosInstance';

export interface CloudManager {
  id: string;
  url: string;
  user_name: string;
  token: string;
  refresh_token: string;
  expired_time: string;
  created_at: string;
  created_by_name: string;
  updated_by_name: string | null;
}

export interface CreateCloudManagerDto {
  url: string;
  user_name: string;
  pass: string;
  token: string;
  refresh_token: string;
  expired_time: string;
}

export interface UpdateCloudManagerDto {
  url?: string;
  user_name?: string;
  pass?: string;
  token?: string;
  refresh_token?: string;
  expired_time?: string;
}

export interface Agent {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  os_version: string;
  cpu_info: string;
  ram_total_gb: number;
  disk_total_gb: number;
  last_seen: number;
  status: string;
}

export interface AgentsResponse {
  cloud_manager_id: string;
  agents: Agent[];
  count: number;
}

class CloudManagersService {
  // Lấy danh sách cloud managers
  async getAll(page: number = 1, size: number = 20, params = {}): Promise<any> {
    try {
      const res = await axiosInstance.get("cloud-managers", {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching cloud managers:', error);
      throw error;
    }
  }

  // Lấy thông tin cloud manager theo ID
  async getById(id: string): Promise<CloudManager> {
    try {
      const res = await axiosInstance.get(`cloud-managers/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching cloud manager:', error);
      throw error;
    }
  }

  // Tạo cloud manager mới
  async create(data: CreateCloudManagerDto): Promise<any> {
    try {
      const res = await axiosInstance.post("cloud-managers", {
        ...data
      });
      return res;
    } catch (error) {
      console.error('Error creating cloud manager:', error);
      throw error;
    }
  }

  // Cập nhật cloud manager
  async update(id: string, data: UpdateCloudManagerDto): Promise<any> {
    try {
      const res = await axiosInstance.put(`cloud-managers/${id}`, data);
      return res;
    } catch (error) {
      console.error('Error updating cloud manager:', error);
      throw error;
    }
  }

  // Xóa cloud manager
  async delete(id: string): Promise<any> {
    try {
      const res = await axiosInstance.delete(`cloud-managers/${id}`);
      return res;
    } catch (error) {
      console.error('Error deleting cloud manager:', error);
      throw error;
    }
  }

  // Lấy danh sách agents của cloud manager
  async getAgents(cloudManagerId: string): Promise<AgentsResponse> {
    try {
      const res = await axiosInstance.get(`cloud-management/${cloudManagerId}/agents`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }
}

const cloudManagersService = new CloudManagersService();
export default cloudManagersService;
