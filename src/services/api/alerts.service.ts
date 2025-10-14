import axiosInstance from './axiosInstance';

// Types
export interface Alert {
  id: string;
  agent_id: string;
  hostname: string;
  ts: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  summary: string;
  details_json: any;
  dedup_hash: string;
  is_processed: number;
  file_path: string | null;
  file_hash: string | null;
  yara_rule: string | null;
  cloud_manager_id: string;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  agent: {
    id: string;
    device_name: string;
    device_status: string;
    agent_id: string;
  };
}

export interface AlertSeverityBreakdown {
  severity: string;
  count: string;
}

export interface AlertProcessedBreakdown {
  status: string;
  count: string;
}
export interface AlertTypeBreakdown {
  type: string;
  count: string;
}
export interface AlertsStatistics {
  statusCode: string;
  message: string;
  data: {
    period: string | null;
    summary: {
      total_alerts: number;
      type_breakdown: AlertTypeBreakdown[];
      severity_breakdown: AlertSeverityBreakdown[];
      processed_breakdown: AlertProcessedBreakdown[];
    };
  };
}

export interface CreateAlertDto {
  agent_id: string;
  hostname: string;
  ts: number;
  type: string;
  severity: string;
  count: string;
}

export interface UpdateAlertDto {
  hostname?: string;
  type?: string;
  severity?: string;
  source?: string;
  summary?: string;
  is_processed?: number;
  details_json?: any;
  file_path?: string;
  file_hash?: string;
  yara_rule?: string;
}

export interface AlertsParams {
  page?: number;
  limit?: number;
  search?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  is_processed?: 0 | 1;
  type?: string;
  agent_id?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface AlertsResponse {
  statusCode: string;
  message: string;
  data: {
    alerts: Alert[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface AlertStats {
  total: number;
  bySeverity: {
    low?: number;
    medium?: number;
    high?: number;
    critical?: number;
  };
  byType: {
    [key: string]: number;
  };
  byStatus: {
    unprocessed: number;
    processed: number;
  };
  recent: number;
}

export interface AlertStatsResponse {
  statusCode: string;
  message: string;
  data: AlertStats;
}

class AlertsService {
  private baseUrl = '/alerts';

  async getAll(
    page: number = 1,
    limit: number = 20,
    params?: AlertsParams
  ): Promise<AlertsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.severity) {
      queryParams.append('severity', params.severity);
    }
    if (params?.is_processed !== undefined) {
      queryParams.append('is_processed', params.is_processed.toString());
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    if (params?.agent_id) {
      queryParams.append('agent_id', params.agent_id);
    }
    if (params?.sort_by) {
      queryParams.append('sort_by', params.sort_by);
    }
    if (params?.sort_order) {
      queryParams.append('sort_order', params.sort_order);
    }

    const response = await axiosInstance.get<AlertsResponse>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getById(id: string): Promise<Alert> {
    const response = await axiosInstance.get<{
      statusCode: string;
      message: string;
      data: Alert;
    }>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(data: CreateAlertDto): Promise<Alert> {
    const response = await axiosInstance.post<{
      statusCode: string;
      message: string;
      data: Alert;
    }>(this.baseUrl, data);
    return response.data.data;
  }
  async getStatistics(start_date?: string, end_date?: string): Promise<AlertsStatistics> {
    try {
      const params: any = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      
      const response = await axiosInstance.get('/dashboard/alerts/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts statistics:', error);
      throw error;
    }
  }
  async update(id: string, data: UpdateAlertDto): Promise<Alert> {
    const response = await axiosInstance.put<{
      statusCode: string;
      message: string;
      data: Alert;
    }>(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/bulk-delete`, { ids });
  }

  async markAsProcessed(id: string): Promise<Alert> {
    return this.update(id, { is_processed: 1 });
  }

  async markMultipleAsProcessed(ids: string[]): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/bulk-process`, { ids });
  }

  async exportCSV(params?: AlertsParams, limit: number = 1000): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.severity) {
      queryParams.append('severity', params.severity);
    }
    if (params?.is_processed !== undefined) {
      queryParams.append('is_processed', params.is_processed.toString());
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    if (params?.agent_id) {
      queryParams.append('agent_id', params.agent_id);
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

  async getStats(): Promise<AlertStats> {
    const response = await axiosInstance.get<AlertStatsResponse>(`${this.baseUrl}/stats`);
    return response.data.data;
  }
}

export const alertsService = new AlertsService();
export default alertsService;

