import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Device interfaces based on the API response
export interface ManagedDevice {
  id: string;
  device_name: string;
  serial_number: string;
  ip_address: string;
  device_status: string;
  description: string;
  device_type_id: string;
  owner: string;
  date_received: string | null;
  agent_id: string;
  token: string;
  host: string;
  os: string;
  os_version: string;
  cpu_info: string;
  ram_total_gb: string;
  created_at: string;
  device_type_name: string;
  owner_name: string;
  created_by_name: string;
  updated_by_name: string;
}

export interface ManagedDevicesResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: ManagedDevice[];
  };
}

export interface CreateManagedDeviceDto {
  device_name: string;
  serial_number: string;
  ip_address: string;
  device_status?: string;
  description?: string;
  device_type_id: string;
  owner: string;
  date_received?: string;
  agent_id?: string;
  token?: string;
  host?: string;
  os?: string;
  os_version?: string;
  cpu_info?: string;
  ram_total_gb?: string;
}

export interface UpdateManagedDeviceDto {
  device_name?: string;
  serial_number?: string;
  ip_address?: string;
  device_status?: string;
  description?: string;
  device_type_id?: string;
  owner?: string;
  date_received?: string;
  agent_id?: string;
  token?: string;
  host?: string;
  os?: string;
  os_version?: string;
  cpu_info?: string;
  ram_total_gb?: string;
}

class ManagedDevicesService {
  async getAll(): Promise<ManagedDevicesResponse> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MANAGED_DEVICES.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching managed devices:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<ManagedDevice> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MANAGED_DEVICES.GET(id));
      return response.data.data;
    } catch (error) {
      console.error('Error fetching managed device:', error);
      throw error;
    }
  }

  async create(data: CreateManagedDeviceDto): Promise<ManagedDevice> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.MANAGED_DEVICES.CREATE, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating managed device:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateManagedDeviceDto): Promise<ManagedDevice> {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.MANAGED_DEVICES.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating managed device:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.MANAGED_DEVICES.DELETE(id));
    } catch (error) {
      console.error('Error deleting managed device:', error);
      throw error;
    }
  }
}

export default new ManagedDevicesService();
