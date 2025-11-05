import { authService, usersService } from '@/services/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { User } from '@/services/api/users.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in (from localStorage)
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const navigate = useNavigate();

  // Fetch current user info when authenticated
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isAuthenticated && !user) {
        try {
          // Try to get user info from login response stored in localStorage
          const loginResponse = localStorage.getItem('loginResponse');
          if (loginResponse) {
            try {
              const parsed = JSON.parse(loginResponse);
              if (parsed.user || parsed.data?.user) {
                const userData = parsed.user || parsed.data.user;
                // Map the user data to our User interface
                if (userData.user_name || userData.userName) {
                  // If we have user info, we might need to fetch full details
                  // For now, use what we have
                  setUser(userData);
                  localStorage.setItem('user', JSON.stringify(userData));
                }
              }
            } catch (e) {
              console.error('Error parsing login response:', e);
            }
          }
          
          // If we have username, try to fetch user details
          // Note: This requires an API endpoint to get current user
          // For now, we'll use the username from login
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated, user]);

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
      
      // console.log(res);
      
      if (res.data) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem("auth_token", res.data.tokens.accessToken);
        
        // Try to get user info from response
        let userInfo: User | null = null;
        if (res.data.user) {
          userInfo = res.data.user;
        } else if (res.data.data?.user) {
          userInfo = res.data.data.user;
        }
        
        // If we have user info, save it
        if (userInfo) {
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          // If no user info in response, try to fetch user list and find current user
          // This is a workaround - ideally API should return user info in login response
          try {
            const usersResponse = await usersService.getAll(1, 1000, { name: username });
            const users = usersResponse.rows || usersResponse.data || [];
            const currentUser = users.find((u: User) => u.user_name === username);
            
            if (currentUser) {
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));
            } else {
              // Fallback: create minimal user object
              const minimalUser: User = {
                id: '',
                user_name: username,
                display_name: username,
                email: null,
                phone_number: null,
                is_online: true,
                is_active: true,
                organization_id: null,
                unit_id: null,
                created_at: new Date().toISOString(),
                created_by: null,
                role: {
                  id: '',
                  display_name: 'User',
                  description: '',
                  code: 'USER'
                },
                organization: null,
                unit: null
              };
              setUser(minimalUser);
              localStorage.setItem('user', JSON.stringify(minimalUser));
            }
          } catch (fetchError) {
            console.error('Error fetching user info:', fetchError);
            // Fallback: create minimal user object
            const minimalUser: User = {
              id: '',
              user_name: username,
              display_name: username,
              email: null,
              phone_number: null,
              is_online: true,
              is_active: true,
              organization_id: null,
              unit_id: null,
              created_at: new Date().toISOString(),
              created_by: null,
              role: {
                id: '',
                display_name: 'User',
                description: '',
                code: 'USER'
              },
              organization: null,
              unit: null
            };
            setUser(minimalUser);
            localStorage.setItem('user', JSON.stringify(minimalUser));
          }
        }
        
        // Save login response for debugging
        localStorage.setItem('loginResponse', JSON.stringify(res.data));
        
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
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginResponse');
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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