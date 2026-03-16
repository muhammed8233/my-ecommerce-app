import { createContext, useState, useEffect, type ReactNode } from 'react';
import  { storage } from '../utils/storage';
import type { User, AuthContextType } from '../types'; 


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

// Inside your AuthProvider
const login = async ({ username, password }: any) => {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const data = await res.json();
  
  // DummyJSON returns user info + token. 
  // We manually inject 'ADMIN' role if username is 'emilys' for testing.
  const userWithRole = { 
    ...data, 
    role: data.username === 'emilys' ? 'ADMIN' : 'CUSTOMER' 
  };
  
  setUser(userWithRole);
  localStorage.setItem('user', JSON.stringify(userWithRole));
};

const register = async (formData: any) => {
  const res = await fetch('https://dummyjson.com/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.name.split(' ')[0],
      lastName: formData.name.split(' ')[1] || '',
      email: formData.email,
      password: formData.password,
    }),
  });

  if (!res.ok) throw new Error("Registration failed");
  
  const data = await res.json();
  console.log("Mock Registration Successful:", data);
  return data;
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
      isAdmin: user?.role === 'ADMIN' // Useful helper for your ProtectedRoute
    }}>
      {children}
    </AuthContext.Provider>
  );

};
