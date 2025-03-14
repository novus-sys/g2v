import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '@/lib/axios';
import { User, AuthState, AuthContextType } from '../types/auth';

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
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
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { user, accessToken } = response.data;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken } });
      
      // Store token in localStorage
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
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
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role,
        ...(role === 'student' && { studentDetails: roleDetails?.studentDetails }),
        ...(role === 'vendor' && { businessDetails: roleDetails?.businessDetails })
      });
      
      const { user, accessToken } = response.data;
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, accessToken } });
      
      // Store token in localStorage
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem('accessToken');
    
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  // Initialize auth state from localStorage
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Fetch current user
          const response = await api.get('/auth/me');
          const user = response.data;
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, accessToken: token },
          });
        } catch (error) {
          logout();
        }
      } else {
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