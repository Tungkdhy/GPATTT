import axios from "axios";

interface LoginDto {
  userName: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    userName: string;
    role: string;
  };
}

class AuthService {
  private baseUrl = 'http://10.10.53.58:3003/api/v1';

  async login(data: LoginDto): Promise<any> {
    try {
      const res = await axios.post<any>(
        `${this.baseUrl}/login`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AuthService();
