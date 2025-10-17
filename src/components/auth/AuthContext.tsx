import { authService } from '@/services/api';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in (from localStorage)
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    // Validate input
    if (!username.trim()) {
      toast.error('Tên đăng nhập không được để trống');
      return false;
    }
    
    if (!password.trim()) {
      toast.error('Mật khẩu không được để trống');
      return false;
    }

    try {
      const res = await authService.login({
        userName: username,
        password: password
      });
      
      console.log(res);
      
      if (res.data) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem("auth_token", res.data.tokens.accessToken);
        toast.success('Đăng nhập thành công!');
        navigate('/dashboard');
        return true;
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        return false;
      }
    } catch (e: any) {
      console.error('Login error:', e);
      
      // Get error message from response
      let errorMessage = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại';
      
      if (e.response?.data?.message) {
        // Use message from API response
        errorMessage = e.response.data.message;
      } else if (e.response?.status === 401) {
        errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
      } else if (e.response?.status === 403) {
        errorMessage = 'Tài khoản của bạn đã bị khóa';
      } else if (e.response?.status === 429) {
        errorMessage = 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau';
      } else if (e.response?.status >= 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau';
      } else if (e.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Không có kết nối mạng. Vui lòng kiểm tra kết nối internet';
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('auth_token');
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}