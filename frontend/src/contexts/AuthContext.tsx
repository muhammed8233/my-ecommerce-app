import { createContext, useState, useEffect, type ReactNode } from 'react';
import  { storage } from '../utils/storage';
import type { User, AuthContextType } from '../types'; 
import client from '../service/client';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
    const savedUser = storage.get<User>('user'); 
    
    if (savedUser) {
      setUser(savedUser); 
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }: any) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      
      // Now you get EVERYTHING you need in one response
      const { token, name, email: userEmail, role } = response.data; 

      const loggedInUser: User = {
        id: userEmail, 
        name,
        email: userEmail,
        role, // 'ADMIN' or 'CUSTOMER' from Spring Boot
        token
      };

      setUser(loggedInUser);
      storage.set('user', loggedInUser);
      storage.set('token', token); 

      return true; // Success!
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  const register = async (formData: any) => {
    try {
      const response = await client.post('/auth/register', formData);
      const data = response.data;

      // If your Spring service returns the token/user upon registration
      if (data.token) {
        const loggedInUser: User = {
          id: data.email,
          name: data.name,
          email: data.email,
          role: data.role || 'USER',
          token: data.token
        };
        setUser(loggedInUser);
        storage.set('user', loggedInUser);
        storage.set('token', data.token);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

    // For Resend Token
  const resendToken = async (email: string) => {
    // Second argument is data (empty {}), third is config (params)
    return await client.post('/auth/resend-token', {}, { 
      params: { email } 
    });
  };

  // For Verify Token
  const verifyToken = async (email: string, token: string) => {
    return await client.post('/auth/verify-token', {}, { 
      params: { email, token } 
    });
  };


  const logout = () => {
    setUser(null);
    storage.remove('user');
    storage.remove('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, // Add this
      logout, 
      loading,
      isAdmin: user?.role === 'ADMIN', // Useful helper for your ProtectedRoute
      resendToken ,
      verifyToken,
    }}>
      {children}
    </AuthContext.Provider>
  );

};
