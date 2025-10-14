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
}

export const scriptsService = new ScriptsService();
export default scriptsService;

