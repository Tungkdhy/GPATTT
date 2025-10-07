import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

export interface ManagerVersionItem {
	id: string;
	version_name: string;
	hash_version: string;
	created_by: string;
	created_by_name: string;
	created_at: string; // ISO string
}

export interface ManagerVersionsListResponse {
	message: string;
	data: {
		count: number;
		rows: ManagerVersionItem[];
	};
}

export interface CreateManagerVersionDto {
	version_name: string;
	hash_version: string;
}

export interface UpdateManagerVersionDto {
	version_name?: string;
	hash_version?: string;
}

class ManagerVersionsService {
	async list(params?: Record<string, any>): Promise<ManagerVersionsListResponse> {
		const response = await axiosInstance.get(API_ENDPOINTS.MANAGER_VERSIONS.LIST, { params });
		return response.data;
	}

	async create(data: CreateManagerVersionDto): Promise<ManagerVersionItem> {
		const response = await axiosInstance.post(API_ENDPOINTS.MANAGER_VERSIONS.CREATE, data);
		return response.data?.data ?? response.data;
	}

	async update(id: string, data: UpdateManagerVersionDto): Promise<ManagerVersionItem> {
		const response = await axiosInstance.put(API_ENDPOINTS.MANAGER_VERSIONS.UPDATE(id), data);
		return response.data?.data ?? response.data;
	}

	async remove(id: string): Promise<void> {
		await axiosInstance.delete(API_ENDPOINTS.MANAGER_VERSIONS.DELETE(id));
	}

	async getById(id: string): Promise<ManagerVersionItem> {
		const response = await axiosInstance.get(API_ENDPOINTS.MANAGER_VERSIONS.GET(id));
		return response.data?.data ?? response.data;
	}
}

export default new ManagerVersionsService();
