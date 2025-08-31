import { apiClient, setAuthToken } from './client';
import { User, UserLogin, AuthResponse } from '../types/buisness';

export class AuthService {
  static async register(credentials: UserLogin): Promise<{ message: string; user: User }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');
    
    const response = await apiClient.post('/register', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  static async login(credentials: UserLogin): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');
    
    console.log('Login attempt with:', { username: credentials.username, grant_type: 'password' });
    
    const response = await apiClient.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('Login response received:', response);
    console.log('Response data:', response.data);
    
    const authResponse: AuthResponse = response.data;
    console.log('Parsed auth response:', authResponse);
    
    setAuthToken(authResponse.access_token);
    console.log('Token saved to storage');
    
    return authResponse;
  }

  static async getToken(credentials: UserLogin): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password');
    
    const response = await apiClient.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const authResponse: AuthResponse = response.data;
    setAuthToken(authResponse.access_token);
    return authResponse;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/me');
    return response.data;
  }

  static logout(): void {
    setAuthToken(null);
  }
}
