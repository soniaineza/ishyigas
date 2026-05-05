import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAsAdmin, loginAsAgent } = useAuth();
  const { loginAgent } = useData();
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin login
    if (username === 'admin' && password === 'admin123') {
      loginAsAdmin();
      navigate('/admin', {
        replace: true
      });
      toast.success('Welcome back, Admin');
      return;
    }
    // Agent login
    const result = loginAgent(username, password);
    if (result.success && result.agent) {
      loginAsAgent(result.agent.id, result.agent.name, result.agent.district);
      navigate('/agent', {
        replace: true
      });
      if (result.agent.status === 'suspended') {
        toast.warning(result.message);
      } else {
        toast.success(result.message);
      }
    } else {
      toast.error(result.message);
    }
  };
  const fillDemoAccount = (role: 'admin' | 'agent') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('agent1');
      setPassword('agent123');
    }
  };
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-800/50 blur-3xl"></div>
        <div className="absolute top-1/4 -left-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <span className="text-white font-semibold tracking-widest text-sm uppercase">
              Republic of Rwanda
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Ishyiga
            <br />
            Distribution
            <br />
            System
          </h1>
          <p className="text-blue-200 text-lg max-w-md">
            Secure, transparent, and efficient management of citizen
            distribution programs across all districts.
          </p>
        </div>

        <div className="relative z-10 text-blue-300 text-sm">
          &copy; {new Date().getFullYear()} Government of Rwanda. All rights
          reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Ishyiga System
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Sign in
              </h2>
              <p className="text-slate-500">
                Enter your credentials to access the system
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors"
                    placeholder="Enter username"
                    required />
                  
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors"
                    placeholder="••••••••"
                    required />
                  
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                
                Sign In
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">
                Demo Accounts:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="flex flex-col items-start p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left">
                  
                  <span className="text-xs font-semibold text-blue-600 mb-1">
                    Admin Role
                  </span>
                  <span className="text-xs text-slate-500">
                    admin / admin123
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('agent')}
                  className="flex flex-col items-start p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left">
                  
                  <span className="text-xs font-semibold text-green-600 mb-1">
                    Agent Role
                  </span>
                  <span className="text-xs text-slate-500">
                    agent1 / agent123
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};