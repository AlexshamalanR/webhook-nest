import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.headers.post['Content-Type'] = 'application/json';

interface User {
  id: number;
  email: string;
  api_key: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to set auth token in axios headers
  const setAuthToken = (token: string | null) => {
    if (token) {
      console.log('Setting auth token in headers');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      console.log('Removing auth token from headers');
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Function to fetch user data
  const fetchUserData = async (token: string) => {
    try {
      console.log('Fetching user data with token');
      setAuthToken(token);
      const response = await axios.get('/api/auth/me');
      console.log('User data fetched:', response.data);
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      setAuthToken(null);
      setUser(null);
      return false;
    }
  };

  // Check for existing token and restore user session
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Checking for existing token:', token ? 'Found' : 'Not found');
    
    if (token) {
      fetchUserData(token)
        .then(success => {
          if (!success) {
            console.log('Failed to restore user session');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log('No token found, skipping session restoration');
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Making login request to:', `${axios.defaults.baseURL}/api/auth/login`);
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Making registration request to:', `${axios.defaults.baseURL}/api/auth/register`);
      const response = await axios.post('/api/auth/register', { email, password });
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Registration error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers
          }
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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