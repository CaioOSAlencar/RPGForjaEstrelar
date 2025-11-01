import { api } from './api';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};