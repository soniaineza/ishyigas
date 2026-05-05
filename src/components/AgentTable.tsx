import React from 'react';
import { Agent } from '../data/mockData';
import { StatusBadge } from './StatusBadge';
import { useData } from '../context/DataContext';
interface AgentTableProps {
  agents: Agent[];
}
export const AgentTable = ({ agents }: AgentTableProps) => {
  const { toggleAgentStatus } = useData();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Agent Name</th>
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
                <td className="px-6 py-4 text-slate-500">{agent.district}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={agent.status} />
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">
                  {agent.citizensServed}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${agent.status === 'active' ? 'text-red-700 bg-red-50 hover:bg-red-100' : 'text-green-700 bg-green-50 hover:bg-green-100'}`}>
                  
                    {agent.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            )}
            {agents.length === 0 &&
            <tr>
                <td
                colSpan={5}
                className="px-6 py-12 text-center text-slate-500">
                
                  No agents found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>);

};