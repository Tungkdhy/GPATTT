// import axiosInstance from './axiosInstance';
// import { API_ENDPOINTS } from './endpoints';

// Mock data
const mockScenarios = [
  { id: 1, name: 'Phát hiện mã độc', description: 'Kịch bản phát hiện và xử lý mã độc', category: 'Security', priority: 'high', status: 'active', created: '2024-01-10' },
  { id: 2, name: 'Tấn công DDoS', description: 'Phát hiện và ngăn chặn tấn công DDoS', category: 'Network', priority: 'critical', status: 'active', created: '2024-01-08' },
  { id: 3, name: 'Login bất thường', description: 'Phát hiện hoạt động đăng nhập bất thường', category: 'Security', priority: 'medium', status: 'inactive', created: '2024-01-05' },
  { id: 4, name: 'Sử dụng tài nguyên cao', description: 'Giám sát sử dụng CPU/RAM cao', category: 'Performance', priority: 'low', status: 'active', created: '2024-01-03' },
  { id: 5, name: 'Truy cập trái phép', description: 'Phát hiện truy cập không được phép', category: 'Security', priority: 'high', status: 'active', created: '2024-01-01' },
];

export interface Scenario {
  id: number;
  name: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created: string;
}

export interface CreateScenarioDto {
  name: string;
  description: string;
  category: string;
  priority: string;
}

export interface UpdateScenarioDto {
  name?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
}

export interface ScenarioStatistics {
  statusCode: string;
  message: string;
  data: {
    period: string | null;
    summary: {
      total_scenarios: number;
      active_scenarios: number;
      inactive_scenarios: number;
    };
  };
}

class ScenariosService {
  async getAll(): Promise<Scenario[]> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.SCENARIOS.LIST);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockScenarios), 500);
      });
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Scenario> {
    try {
      // const response = await axiosInstance.get(API_ENDPOINTS.SCENARIOS.GET(id));
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const scenario = mockScenarios.find(s => s.id === id);
          if (scenario) {
            resolve(scenario);
          } else {
            reject(new Error('Scenario not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching scenario:', error);
      throw error;
    }
  }

  async create(data: CreateScenarioDto): Promise<Scenario> {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.SCENARIOS.CREATE, data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newScenario: Scenario = {
            id: mockScenarios.length + 1,
            ...data,
            status: 'active',
            created: new Date().toISOString().slice(0, 10)
          };
          resolve(newScenario);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating scenario:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateScenarioDto): Promise<Scenario> {
    try {
      // const response = await axiosInstance.put(API_ENDPOINTS.SCENARIOS.UPDATE(id), data);
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const scenario = mockScenarios.find(s => s.id === id);
          if (scenario) {
            const updatedScenario = { ...scenario, ...data };
            resolve(updatedScenario);
          } else {
            reject(new Error('Scenario not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating scenario:', error);
      throw error;
    }
  }

  async delete(_id: number): Promise<void> {
    try {
      // await axiosInstance.delete(API_ENDPOINTS.SCENARIOS.DELETE(id));
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error) {
      console.error('Error deleting scenario:', error);
      throw error;
    }
  }

  async getStatistics(start_date?: string, end_date?: string): Promise<ScenarioStatistics> {
    try {
      const params: any = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      
      // const response = await axiosInstance.get('/scenarios/statistics', { params });
      // return response.data;
      
      // Mock data for now
      const activeCount = mockScenarios.filter(s => s.status === 'active').length;
      const inactiveCount = mockScenarios.filter(s => s.status === 'inactive').length;
      
      return {
        statusCode: '10000',
        message: 'Scenarios statistics retrieved successfully',
        data: {
          period: null,
          summary: {
            total_scenarios: mockScenarios.length,
            active_scenarios: activeCount,
            inactive_scenarios: inactiveCount
          }
        }
      };
    } catch (error) {
      console.error('Error fetching scenario statistics:', error);
      throw error;
    }
  }
}

export default new ScenariosService();
