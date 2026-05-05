import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PackageCheck,
  UserCog,
  BarChart3,
  LogOut,
  ShieldAlert } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Sidebar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  const isAdmin = user.role === 'admin';
  const navItems = isAdmin ?
  [
  {
    to: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    to: '/admin/citizens',
    icon: Users,
    label: 'Citizen Records'
  },
  {
    to: '/admin/agents',
    icon: UserCog,
    label: 'Agent Management'
  },
  {
    to: '/admin/reports',
    icon: BarChart3,
    label: 'Reports'
  }] :

  [
  {
    to: '/agent',
    icon: PackageCheck,
    label: 'Distribution'
  }];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
          <ShieldAlert size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight leading-tight">
            ISHYIGA
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Distribution System
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <p className="text-sm font-medium truncate">{user.name}</p>
        <p className="text-xs text-slate-400 capitalize">{user.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) =>
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin' || item.to === '/agent'}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
          }>
          
            <item.icon size={18} />
            {item.label}
          </NavLink>
        )}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
          
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>);

};