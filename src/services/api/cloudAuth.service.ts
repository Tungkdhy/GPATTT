import axiosInstance from './axiosInstance';

export interface TokenDetails {
  id: string;
  url: string;
  user_name: string;
  token_status: 'active' | 'inactive';
  token_preview: string | null;
  refresh_token_status: 'active' | 'inactive';
  refresh_token_preview: string | null;
  expired_time: string;
  is_expired: boolean;
  days_until_expiry: number;
  created_at: string;
  updated_at: string;
}

export interface CloudAuthManager {
  id: string;
  name: string;
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  token_details?: TokenDetails;
}

export interface TokenDetailsResponse {
  statusCode: string;
  message: string;
  data: {
    token_details: TokenDetails;
  };
}

export interface CloudAuthManagersResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: CloudAuthManager[];
  };
}

class CloudAuthService {
  // Lấy danh sách cloud managers
  async getAll(pageSize: number = 20, pageIndex: number = 1): Promise<CloudAuthManagersResponse> {
    const response = await axiosInstance.get('/cloud-managers', {
      params: { pageSize, pageIndex }
    });
    return response.data;
  }

  // Lấy token details của một cloud manager
  async getTokenDetails(cloudId: string): Promise<TokenDetailsResponse> {
    const response = await axiosInstance.get(`/cloud-managers/${cloudId}/token-details`);
    return response.data;
  }

  // Xóa cloud manager (và token của nó)
  async delete(cloudId: string): Promise<any> {
    const response = await axiosInstance.delete(`/cloud-managers/${cloudId}`);
    return response.data;
  }

  // Xóa token của cloud manager
  async deleteToken(cloudId: string): Promise<any> {
    const response = await axiosInstance.delete(`/cloud-managers/${cloudId}/tokens`);
    return response.data;
  }
}

export default new CloudAuthService();

