import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, X } from 'lucide-react';
import { rwandaLocations } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
export const AgentManagement = () => {
  const { agents, addAgent, setAgentStatus } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDistrict, setNewAgentDistrict] = useState('');
  const [newAgentUsername, setNewAgentUsername] = useState('');
  const [newAgentPassword, setNewAgentPassword] = useState('');
  const allDistricts = useMemo(() => {
    const districts = new Set<string>();
    Object.values(rwandaLocations).forEach((province) => {
      Object.keys(province).forEach((district) => districts.add(district));
    });
    return Array.from(districts).sort();
  }, []);
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (
    !newAgentName ||
    !newAgentDistrict ||
    !newAgentUsername ||
    !newAgentPassword ||
    !user)

    return;
    addAgent(
      {
        name: newAgentName,
        username: newAgentUsername,
        password: newAgentPassword,
        district: newAgentDistrict,
        status: 'active'
      },
      {
        id: user.id,
        name: user.name
      }
    );
    setNewAgentName('');
    setNewAgentDistrict('');
    setNewAgentUsername('');
    setNewAgentPassword('');
    setIsModalOpen(false);
  };
  const handleStatusChange = (
  agentId: string,
  newStatus: 'active' | 'suspended' | 'disabled') =>
  {
    if (!user) return;
    setAgentStatus(agentId, newStatus, {
      id: user.id,
      name: user.name
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Agent Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage field agents and their district assignments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          
          <Plus size={18} />
          Create Agent
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Agent Name</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Assigned District</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Citizens Served</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {agents.map((agent) =>
              <tr
                key={agent.id}
                className="hover:bg-slate-50 transition-colors">
                
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {agent.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {agent.username}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{agent.district}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={agent.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {agent.citizensServed}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                    value={agent.status}
                    onChange={(e) =>
                    handleStatusChange(agent.id, e.target.value as any)
                    }
                    className="text-xs font-medium border border-slate-300 rounded-md py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-700">
                    
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </td>
                </tr>
              )}
              {agents.length === 0 &&
              <tr>
                  <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500">
                  
                    No agents found. Click "Create Agent" to add one.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Agent Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Create New Agent
              </h2>
              <button
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors">
              
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                type="text"
                required
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="e.g. Jean Claude Uwimana" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                type="text"
                required
                value={newAgentUsername}
                onChange={(e) => setNewAgentUsername(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="e.g. jcuwimana" />
              
                <p className="text-xs text-slate-400 mt-1">
                  The agent will use this to log in
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                type="password"
                required
                value={newAgentPassword}
                onChange={(e) => setNewAgentPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="Set a password" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned District
                </label>
                <select
                required
                value={newAgentDistrict}
                onChange={(e) => setNewAgentDistrict(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                
                  <option value="">Select a district</option>
                  {allDistricts.map((d) =>
                <option key={d} value={d}>
                      {d}
                    </option>
                )}
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

};