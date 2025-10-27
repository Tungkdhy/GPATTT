import axios from 'axios';

// Base API URL - có thể thay đổi theo environment
// Sử dụng giá trị mặc định, có thể override bằng cách set window.API_BASE_URL
const API_BASE_URL = (typeof window !== 'undefined' && (window as any).API_BASE_URL) || 'http://10.10.53.58:3003/api/v1/';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý khi token expired
    const errorData = error.response?.data;
    
    // Kiểm tra các trường hợp token hết hạn
    const isTokenExpired = 
      errorData?.message === 'Token is expired' ||
      errorData?.message === 'Token đã hết hạn' ||

      (errorData?.statusCode === '10001' && errorData?.message === 'Token đã hết hạn');
    
    if (isTokenExpired) {
      // Xóa thông tin authentication
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Chuyển hướng về trang login
      window.location.href = '/login';
      
      return Promise.reject(error);
    }

    // Xử lý lỗi 401 - Unauthorized
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('auth_token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }       

    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Xử lý lỗi 500 - Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
