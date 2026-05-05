import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
export const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location
        }}
        replace />);


  }
  // Basic role-based route protection
  if (user.role === 'admin' && location.pathname.startsWith('/agent')) {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'agent' && location.pathname.startsWith('/admin')) {
    return <Navigate to="/agent" replace />;
  }
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>);

};