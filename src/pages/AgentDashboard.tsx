import React, { useState } from 'react';
import { RegisterCitizenForm } from '../components/RegisterCitizenForm';
import { DistributionConfirmation } from '../components/DistributionConfirmation';
import { UserPlus, PackageCheck } from 'lucide-react';
export const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'distribute'>(
    'distribute'
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Manage citizen registrations and confirm distributions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-full max-w-md">
        <button
          onClick={() => setActiveTab('distribute')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'distribute' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          
          <PackageCheck size={18} />
          Confirm Distribution
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          
          <UserPlus size={18} />
          Register Citizen
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'distribute' ?
        <DistributionConfirmation /> :

        <RegisterCitizenForm />
        }
      </div>
    </div>);

};