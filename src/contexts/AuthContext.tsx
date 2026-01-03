import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'invigilator' | 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, { password: string; user: User }> = {
  'inv@university.edu': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'inv@university.edu',
      name: 'Dr. Sharma',
      role: 'invigilator',
    },
  },
  'admin@university.edu': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'admin@university.edu',
      name: 'Prof. Kumar',
      role: 'admin',
    },
  },
  'student@university.edu': {
    password: 'demo123',
    user: {
      id: '3',
      email: 'student@university.edu',
      name: 'Rahul Verma',
      role: 'student',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const demoUser = demoUsers[email.toLowerCase()];
    
    if (demoUser && demoUser.password === password && demoUser.user.role === role) {
      setUser(demoUser.user);
      localStorage.setItem('auth_user', JSON.stringify(demoUser.user));
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
