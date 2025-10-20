import axiosInstance from './axiosInstance';

export interface ScriptHistory {
  id: string;
  script_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  old_values: any;
  new_values: any;
  changed_by: string;
  changed_at: string;
  ip_address: string;
  user_agent: string;
  changed_by_name: string;
}

export interface ScriptHistoryResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: ScriptHistory[];
  };
}

export interface ScriptHistoryFilters {
  pageSize?: number;
  pageIndex?: number;
  script_id?: string;
  action?: string;
  changed_by?: string;
}

class ScriptHistoriesService {
  private baseUrl = 'script-histories';

  async getAll(
    page: number = 1,
    limit: number = 10,
    filters: ScriptHistoryFilters = {}
  ): Promise<ScriptHistoryResponse> {
    const queryParams: any = {
      pageSize: limit,
      pageIndex: page,
      ...filters
    };

    // Remove empty filters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    const response = await axiosInstance.get(this.baseUrl, { params: queryParams });
    return response.data;
  }

  async getById(id: string): Promise<ScriptHistory> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async update(id: string, data: any): Promise<void> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }
}

export const scriptHistoriesService = new ScriptHistoriesService();
export default scriptHistoriesService;

