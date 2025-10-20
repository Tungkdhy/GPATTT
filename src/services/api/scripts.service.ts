import axiosInstance from './axiosInstance';

export interface Script {
  id: string;
  content: string;
  is_published: boolean;
  script_name: string;
  rule_file_name: string;
  script_type_id: string;
  created_at: string;
  created_by_name?: string;
  updated_by_name?: string;
  script_type_name?: string;
}

export interface CreateScriptDto {
  content: string;
  script_name: string;
  rule_file_name: string;
  script_type_id: string;
  is_published: boolean;
}

export interface UpdateScriptDto {
  content?: string;
  script_name?: string;
  rule_file_name?: string;
  script_type_id?: string;
  is_published?: boolean;
}

export interface ScriptResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: Script[];
  };
}

export interface ScriptFilters {
  pageSize?: number;
  pageIndex?: number;
  is_published?: boolean | string;
  script_name?: string;
  rule_file_name?: string;
  script_type_id?: string;
}

export interface ScriptStatistics {
  statusCode: string;
  message: string;
  data: {
    period: string | null;
    summary: {
      total_scripts: number;
      published_scripts: number;
      unpublished_scripts: number;
    };
  };
}

class ScriptsService {
  private baseUrl = 'scripts';

  async getAll(
    page: number = 1,
    limit: number = 10,
    filters: ScriptFilters = {}
  ): Promise<ScriptResponse> {
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

  async getById(id: string): Promise<Script> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(data: CreateScriptDto): Promise<Script> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  async update(id: string, data: UpdateScriptDto): Promise<Script> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  async publish(id: string, is_published: boolean): Promise<Script> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/publish`, { is_published });
    return response.data.data;
  }

  async getStatistics(start_date?: string, end_date?: string): Promise<ScriptStatistics> {
    const params: any = {};
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    
    const response = await axiosInstance.get(`/dashboard/${this.baseUrl}/statistics`, { params });
    console.log(response);
    
    return response.data;
  }

  async exportCSV(params?: ScriptFilters, limit: number = 1000): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (params?.script_name) {
      queryParams.append('script_name', params.script_name);
    }
    if (params?.rule_file_name) {
      queryParams.append('rule_file_name', params.rule_file_name);
    }
    if (params?.script_type_id) {
      queryParams.append('script_type_id', params.script_type_id);
    }
    if (params?.is_published !== undefined) {
      queryParams.append('is_published', params.is_published.toString());
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

export const scriptsService = new ScriptsService();
export default scriptsService;

