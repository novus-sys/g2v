import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '@/lib/axios';
import { User, AuthState, AuthContextType } from '../types/auth';

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'RESTORE_SESSION'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { user, accessToken, refreshToken } = response.data;
      console.log('Login successful, storing tokens...');
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, accessToken, refreshToken } 
      });
      console.log('Login process completed');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string,
    role: 'student' | 'vendor',
    roleDetails?: {
      studentDetails?: {
        studentId: string;
        university: string;
      };
      businessDetails?: {
        businessName: string;
        description: string;
        address: string;
      };
    }
  ) => {
    try {
      console.log('Attempting registration...');
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role,
        ...(role === 'student' && { studentDetails: roleDetails?.studentDetails }),
        ...(role === 'vendor' && { businessDetails: roleDetails?.businessDetails })
      });
      
      const { user, accessToken, refreshToken } = response.data;
      console.log('Registration successful, storing tokens...');
      
      // Store tokens and user data in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user, accessToken, refreshToken } 
      });
      console.log('Registration process completed');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out...');
    // Remove tokens and user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGOUT' });
    console.log('Logout completed');
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  // Initialize auth state from localStorage
  React.useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');
      
      console.log('Stored data:', { 
        hasToken: !!token, 
        hasRefreshToken: !!refreshToken,
        hasStoredUser: !!storedUser 
      });
      
      if (token && refreshToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('Restoring session from localStorage');
          
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, accessToken: token, refreshToken },
          });
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          logout();
        }
      } else {
        console.log('No stored session found');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, [logout]);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 