export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'vendor';
  studentDetails?: {
    studentId: string;
    university: string;
  };
  businessDetails?: {
    businessName: string;
    description: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RoleDetails {
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

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'student' | 'vendor',
    roleDetails?: RoleDetails
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
} 