import axiosInstance from './axiosInstance';

export interface ScriptCategory {
  id: string;
  category_type_id: string;
  display_name: string;
  value: string;
  description: string;
  is_default: boolean;
  is_active: boolean;
  data: any;
  created_by_user: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScriptCategoryDto {
  category_type_id: string;
  display_name: string;
  value: string;
  description?: string;
  data?: any;
}

export interface UpdateScriptCategoryDto {
  category_type_id?: string;
  display_name?: string;
  value?: string;
  description?: string;
  data?: any;
}

export interface ScriptCategoryResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: ScriptCategory[];
  };
}

class ScriptCategoriesService {
  private baseUrl = '/api/v1/category';

  async getAll(page: number = 1, limit: number = 10, params: any = {}): Promise<ScriptCategoryResponse> {
    const queryParams = {
      scope: 'SCRIPT',
      pageSize: limit,
      pageIndex: page,
      ...params
    };

    const response = await axiosInstance.get(this.baseUrl, { params: queryParams });
    return response.data;
  }

  async getById(id: string): Promise<ScriptCategory> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(data: CreateScriptCategoryDto): Promise<ScriptCategory> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  async update(id: string, data: UpdateScriptCategoryDto): Promise<ScriptCategory> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  async getAllSimple(): Promise<ScriptCategory[]> {
    const response = await this.getAll(1, 10000);
    return response.data.rows;
  }
}

export const scriptCategoriesService = new ScriptCategoriesService();
export default scriptCategoriesService;
