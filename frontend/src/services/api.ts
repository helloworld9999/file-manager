/**
 * API 服务配置和基础请求方法
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ErrorResponse } from '@/types/file';

// API基础配置
const API_BASE_URL = 'http://127.0.0.1:8000';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ 请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API响应: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ 响应错误:', error);
    
    // 统一错误处理
    const errorResponse: ErrorResponse = {
      error: error.code || 'NetworkError',
      message: error.message || '网络请求失败',
      details: error.response?.data?.detail || error.response?.statusText
    };
    
    return Promise.reject(errorResponse);
  }
);

// 通用API请求方法
export const api = {
  get: <T>(url: string, params?: any): Promise<T> => 
    apiClient.get(url, { params }).then(response => response.data),
    
  post: <T>(url: string, data?: any): Promise<T> => 
    apiClient.post(url, data).then(response => response.data),
    
  put: <T>(url: string, data?: any): Promise<T> => 
    apiClient.put(url, data).then(response => response.data),
    
  delete: <T>(url: string): Promise<T> => 
    apiClient.delete(url).then(response => response.data),
};

// 健康检查
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('API健康检查失败:', error);
    return false;
  }
};

export default apiClient;
