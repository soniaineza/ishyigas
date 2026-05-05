import React from 'react';
import {
  Users,
  PackageCheck,
  PackageOpen,
  UserCog,
  UserPlus,
  LogIn,
  ShieldAlert,
  Trophy } from
'lucide-react';
import { useData } from '../context/DataContext';
import { SummaryCard } from '../components/SummaryCard';
import {
  DistrictDistributionChart,
  DailyActivityChart } from
'../components/DistributionCharts';
import { StatusBadge } from '../components/StatusBadge';
export const AdminDashboard = () => {
  const { citizens, agents, auditLogs, getTopAgents } = useData();
  const totalRegistered = citizens.length;
  const totalServed = citizens.filter((c) => c.status === 'Received').length;
  const remaining = totalRegistered - totalServed;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const recentDistributions = [...citizens].
  filter((c) => c.status === 'Received').
  sort(
    (a, b) =>
    new Date(b.distributionDate || '').getTime() -
    new Date(a.distributionDate || '').getTime()
  ).
  slice(0, 5);
  const topAgents = getTopAgents(5);
  const recentLogs = auditLogs.slice(0, 15);
  const getLogIcon = (action: string) => {
    switch (action) {
      case 'CREATE_CITIZEN':
        return <UserPlus size={16} className="text-blue-600" />;
      case 'CONFIRM_DISTRIBUTION':
        return <PackageCheck size={16} className="text-green-600" />;
      case 'CREATE_AGENT':
      case 'SUSPEND_AGENT':
      case 'DISABLE_AGENT':
      case 'ENABLE_AGENT':
        return <UserCog size={16} className="text-purple-600" />;
      case 'LOGIN':
        return <LogIn size={16} className="text-slate-600" />;
      default:
        return <ShieldAlert size={16} className="text-slate-400" />;
    }
  };
  const formatLogMessage = (log: any) => {
    switch (log.action) {
      case 'CREATE_CITIZEN':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            registered citizen{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'CONFIRM_DISTRIBUTION':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            confirmed distribution for{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'CREATE_AGENT':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            created new agent{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'SUSPEND_AGENT':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            suspended agent{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'DISABLE_AGENT':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            disabled agent{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'ENABLE_AGENT':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            enabled agent{' '}
            <span className="font-medium text-slate-900">{log.targetName}</span>
          </>);

      case 'LOGIN':
        return (
          <>
            <span className="font-medium text-slate-900">
              {log.performedByName}
            </span>{' '}
            logged in
          </>);

      default:
        return <span>{log.action}</span>;
    }
  };
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          High-level metrics and recent activity across all districts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Registered"
          value={totalRegistered.toLocaleString()}
          icon={Users}
          colorClass="text-blue-600 bg-blue-50" />
        
        <SummaryCard
          title="Total Served"
          value={totalServed.toLocaleString()}
          icon={PackageCheck}
          colorClass="text-green-600 bg-green-50"
          trend={{
            value: 12,
            isPositive: true
          }} />
        
        <SummaryCard
          title="Remaining"
          value={remaining.toLocaleString()}
          icon={PackageOpen}
          colorClass="text-amber-600 bg-amber-50" />
        
        <SummaryCard
          title="Active Agents"
          value={activeAgents}
          icon={UserCog}
          colorClass="text-purple-600 bg-purple-50" />
        
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistrictDistributionChart />
        <DailyActivityChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Distributions
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Citizen Name</th>
                  <th className="px-6 py-3 font-medium">National ID</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentDistributions.map((citizen) =>
                <tr
                  key={citizen.id}
                  className="hover:bg-slate-50 transition-colors">
                  
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {citizen.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {citizen.nationalId}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {citizen.district}, {citizen.sector}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={citizen.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {citizen.distributionDate}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {citizen.agentName}
                    </td>
                  </tr>
                )}
                {recentDistributions.length === 0 &&
                <tr>
                    <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500">
                    
                      No recent distributions found.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top Agents & Activity Feed */}
        <div className="space-y-6">
          {/* Top Performing Agents */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Agents
              </h3>
              <Trophy size={20} className="text-amber-500" />
            </div>
            <div className="p-2">
              {topAgents.map((agent, index) =>
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                
                  <div className="flex items-center gap-3">
                    <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'}`}>
                    
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {agent.name}
                      </p>
                      <p className="text-xs text-slate-500">{agent.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {agent.citizensServed}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Served
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Activity Feed
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {recentLogs.map((log, index) =>
                <div
                  key={log.id}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {getLogIcon(log.action)}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500">
                          {formatTimeAgo(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {formatLogMessage(log)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};