import axiosInstance from './axiosInstance';

// Types
export interface UnsafeDevice {
  agent_id: string;
  device_name: string;
  device_status: string;
  hostname: string;
  alert_count: number;
  latest_alert: string;
  severity_levels: {
    low?: number;
    medium?: number;
    high?: number;
    critical?: number;
  };
  alert_types: {
    [key: string]: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateUnsafeDeviceDto {
  agent_id: string;
  device_name: string;
  device_status: string;
  hostname?: string;
}

export interface UpdateUnsafeDeviceDto {
  device_name?: string;
  device_status?: string;
  hostname?: string;
}

export interface UnsafeDevicesParams {
  page?: number;
  limit?: number;
  search?: string;
  device_status?: string;
  min_alert_count?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface UnsafeDevicesResponse {
  statusCode: string;
  message: string;
  data: {
    devices: UnsafeDevice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class UnsafeDevicesService {
  private baseUrl = '/unsafe-devices';

  async getAll(
    page: number = 1,
    limit: number = 10,
    params?: UnsafeDevicesParams
  ): Promise<UnsafeDevicesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.device_status) {
      queryParams.append('device_status', params.device_status);
    }
    if (params?.min_alert_count !== undefined) {
      queryParams.append('min_alert_count', params.min_alert_count.toString());
    }
    if (params?.severity) {
      queryParams.append('severity', params.severity);
    }
    if (params?.sort_by) {
      queryParams.append('sort_by', params.sort_by);
    }
    if (params?.sort_order) {
      queryParams.append('sort_order', params.sort_order);
    }

    const response = await axiosInstance.get<UnsafeDevicesResponse>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getById(agentId: string): Promise<UnsafeDevice> {
    const response = await axiosInstance.get<{
      statusCode: string;
      message: string;
      data: UnsafeDevice;
    }>(`${this.baseUrl}/${agentId}`);
    return response.data.data;
  }

  async create(data: CreateUnsafeDeviceDto): Promise<UnsafeDevice> {
    const response = await axiosInstance.post<{
      statusCode: string;
      message: string;
      data: UnsafeDevice;
    }>(this.baseUrl, data);
    return response.data.data;
  }

  async update(agentId: string, data: UpdateUnsafeDeviceDto): Promise<UnsafeDevice> {
    const response = await axiosInstance.put<{
      statusCode: string;
      message: string;
      data: UnsafeDevice;
    }>(`${this.baseUrl}/${agentId}`, data);
    return response.data.data;
  }

  async delete(agentId: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${agentId}`);
  }

  async deleteMultiple(agentIds: string[]): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/bulk-delete`, { agent_ids: agentIds });
  }

  async exportCSV(params?: UnsafeDevicesParams, limit: number = 1000): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.device_status) {
      queryParams.append('device_status', params.device_status);
    }
    if (params?.min_alert_count !== undefined) {
      queryParams.append('min_alert_count', params.min_alert_count.toString());
    }
    if (params?.severity) {
      queryParams.append('severity', params.severity);
    }
    if (params?.sort_by) {
      queryParams.append('sort_by', params.sort_by);
    }
    if (params?.sort_order) {
      queryParams.append('sort_order', params.sort_order);
    }

    const response = await axiosInstance.get(
      `${this.baseUrl}/export/csv?${queryParams.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }
}

export const unsafeDevicesService = new UnsafeDevicesService();
export default unsafeDevicesService;

