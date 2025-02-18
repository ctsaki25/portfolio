import React, { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login...');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('Using base URL:', baseURL);

      const response = await axios.post(`${baseURL}/api/v1/auth/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      const { token } = response.data;
      console.log('Received token:', token);
      
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
      
      console.log('Login successful');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Login error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 