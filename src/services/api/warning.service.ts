import axiosInstance from './axiosInstance';

export interface Warning {
  id: string;
  display_name: string;
  usage: number;
  total: number;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  is_process: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by_user: {
    id: string;
    display_name: string;
  };
}

export interface WarningParams {
  search?: string;
  [key: string]: any;
}

export interface WarningResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: Warning[];
  };
}

class WarningService {
  // Lấy danh sách warnings với phân trang
  async getAll(page: number = 1, size: number = 10, params: WarningParams = {}): Promise<WarningResponse> {
    try {
      const res = await axiosInstance.get("warning", {
        params: {
          pageSize: size,
          pageIndex: page,
          ...params
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching warnings:', error);
      throw error;
    }
  }

  // Cập nhật warning
  async update(id: string, data: { is_process?: boolean }): Promise<any> {
    try {
      const res = await axiosInstance.put(`warning/${id}`, data);
      return res;
    } catch (error) {
      console.error('Error updating warning:', error);
      throw error;
    }
  }

  // Đánh dấu đã xử lý
  async markAsProcessed(id: string): Promise<any> {
    try {
      const res = await axiosInstance.put(`warning/${id}`, { is_process: true });
      return res;
    } catch (error) {
      console.error('Error marking warning as processed:', error);
      throw error;
    }
  }

  // Đánh dấu nhiều warnings đã xử lý
  async markMultipleAsProcessed(ids: string[]): Promise<any> {
    try {
      const res = await axiosInstance.post('warning/mark-processed', { ids });
      return res;
    } catch (error) {
      console.error('Error marking multiple warnings as processed:', error);
      throw error;
    }
  }

  // Xóa warning
  async delete(id: string): Promise<any> {
    try {
      const res = await axiosInstance.delete(`warning/${id}`);
      return res;
    } catch (error) {
      console.error('Error deleting warning:', error);
      throw error;
    }
  }

  // Xóa nhiều warnings
  async deleteMultiple(ids: string[]): Promise<any> {
    try {
      const res = await axiosInstance.post('warning/delete-multiple', { ids });
      return res;
    } catch (error) {
      console.error('Error deleting multiple warnings:', error);
      throw error;
    }
  }
}

export default new WarningService();

