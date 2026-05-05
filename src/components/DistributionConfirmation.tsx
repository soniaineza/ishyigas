import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  PauseCircle } from
'lucide-react';
import { StatusBadge } from './StatusBadge';
export const DistributionConfirmation = () => {
  const { citizens, agents, updateCitizenStatus } = useData();
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [searchedCitizen, setSearchedCitizen] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  // Find the current agent's full record to check status
  const currentAgent = agents.find((a) => a.id === user?.id);
  const isSuspended = currentAgent?.status === 'suspended';
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    const found = citizens.find((c) => c.nationalId === searchId);
    setSearchedCitizen(found || null);
    setHasSearched(true);
  };
  const handleConfirmDistribution = () => {
    if (!searchedCitizen || !user || !currentAgent) return;
    const success = updateCitizenStatus(searchedCitizen.nationalId, {
      id: currentAgent.id,
      name: currentAgent.name,
      district: currentAgent.district,
      status: currentAgent.status
    });
    if (success) {
      setSearchedCitizen({
        ...searchedCitizen,
        status: 'Received',
        distributionDate: new Date().toISOString().split('T')[0],
        agentName: user.name
      });
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Confirm Distribution
        </h2>
        <p className="text-sm text-slate-500">
          Search by National ID to verify and confirm distribution.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm font-mono"
              placeholder="Enter 16-digit National ID..." />
            
          </div>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            
            Search
          </button>
        </form>

        {hasSearched && !searchedCitizen &&
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Citizen Not Found
            </h3>
            <p className="text-slate-500">
              No record found with National ID:{' '}
              <span className="font-mono">{searchId}</span>
            </p>
          </div>
        }

        {searchedCitizen &&
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {searchedCitizen.name}
                </h3>
                <p className="text-sm font-mono text-slate-500">
                  {searchedCitizen.nationalId}
                </p>
              </div>
              <StatusBadge status={searchedCitizen.status} />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-sm text-slate-900">
                    {searchedCitizen.district}, {searchedCitizen.sector}
                  </p>
                  <p className="text-sm text-slate-500">
                    {searchedCitizen.cell}, {searchedCitizen.village}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Contact
                  </p>
                  <p className="text-sm text-slate-900">
                    {searchedCitizen.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Registration Details
                  </p>
                  <p className="text-sm text-slate-900">
                    Date: {searchedCitizen.registrationDate}
                  </p>
                  {searchedCitizen.registeredBy &&
                <p className="text-sm text-slate-500">
                      By: {searchedCitizen.registeredBy}
                    </p>
                }
                </div>
                {searchedCitizen.status === 'Received' &&
              <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Distribution Details
                    </p>
                    <p className="text-sm text-slate-900">
                      Date: {searchedCitizen.distributionDate}
                    </p>
                    <p className="text-sm text-slate-900">
                      Agent: {searchedCitizen.agentName}
                    </p>
                  </div>
              }
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              {searchedCitizen.status === 'Not Received' ?
            isSuspended ?
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-lg text-sm font-medium w-full justify-center">
                    <PauseCircle size={18} />
                    Your account is suspended. You cannot confirm distributions.
                    Contact your administrator.
                  </div> :

            <button
              onClick={handleConfirmDistribution}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              
                    <PackageCheck size={18} />
                    Confirm Distribution
                  </button> :


            <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2.5 rounded-lg font-medium">
                  <CheckCircle2 size={18} />
                  Distribution Already Completed
                </div>
            }
            </div>
          </div>
        }
      </div>
    </div>);

};