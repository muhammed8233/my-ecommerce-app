import client from './client';
import type { User } from '../types';


export interface LoginResponse extends User {
  // Inherits id, name, email, role, and token from User
}

const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    // Matches your Spring Boot @PostMapping for authentication
    const response = await client.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any): Promise<User> => {
    const response = await client.post<User>('/auth/register', userData);
    return response.data;
  }
};

export default authService;
