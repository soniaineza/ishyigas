import React, { useState, createContext, useContext } from 'react';
import { User } from '../data/mockData';
interface AuthContextType {
  user: User | null;
  loginAsAdmin: () => void;
  loginAsAgent: (agentId: string, agentName: string, district: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const loginAsAdmin = () => {
    setUser({
      id: 'u1',
      username: 'admin',
      name: 'System Admin',
      role: 'admin'
    });
  };
  const loginAsAgent = (
  agentId: string,
  agentName: string,
  district: string) =>
  {
    setUser({
      id: agentId,
      username: agentName,
      name: agentName,
      role: 'agent',
      district
    });
  };
  const logout = () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loginAsAdmin,
        loginAsAgent,
        logout
      }}>
      
      {children}
    </AuthContext.Provider>);

};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};