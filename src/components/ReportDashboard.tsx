import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  TooltipProps
} from 'recharts';
import { escapeCsvValue } from '../utils/csv';
import { StatusBadge } from './StatusBadge';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const StatCard = ({ title, value, change, isPositive, subtitle }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <div className="flex items-baseline justify-between mt-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {isPositive ? '↑' : '↓'} {change}
      </span>
    </div>
    <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
  </div>
);

const ReportDashboard: React.FC = () => {
  const { citizens, agents } = useData();

  // Logic for CSV/Excel Export
  const exportData = () => {
    const headers = ['Name', 'National ID', 'District', 'Sector', 'Status', 'Distribution Date', 'Agent']; // 7 headers

    const rows = citizens.map(c => [
      escapeCsvValue(c.name),
      `'${c.nationalId}`, 
      escapeCsvValue(c.district),
      escapeCsvValue(c.sector),
      c.status,
      c.distributionDate || 'N/A',
      escapeCsvValue(c.agentName || 'System')
    ]);

    
    const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = `ishyiga_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Data exported successfully`);
  };


  const downloadPDF = () => {
    toast.info("Preparing professional report view...");
   
    const originalTitle = document.title;
    document.title = `Ishyiga_Executive_Analytics_${new Date().toISOString().split('T')[0]}`;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  const metrics = useMemo(() => {
    const total = citizens.length;
    const received = citizens.filter(c => c.status === 'Received').length;
    const pending = total - received;
    const rate = total > 0 ? ((received / total) * 100).toFixed(1) : "0";
    const activeAgents = agents.filter(a => a.status === 'active').length;
    
    
    const dailyData: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => dailyData[date] = 0);
    citizens.forEach(c => {
      if (c.status === 'Received' && c.distributionDate && dailyData[c.distributionDate] !== undefined) {
        dailyData[c.distributionDate]++;
      }
    });

    const trendChart = Object.entries(dailyData).map(([date, count]) => ({
      date: date.split('-').slice(1).join('/'),
      count
    }));

    
    const districtMap: Record<string, number> = {};
    citizens.forEach(c => {
      if (c.status === 'Received') {
        districtMap[c.district] = (districtMap[c.district] || 0) + 1;
      }
    });
    const districtChart = Object.entries(districtMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const recentActivity = [...citizens]
      .filter(c => c.status === 'Received')
      .sort((a, b) => new Date(b.distributionDate || '').getTime() - new Date(a.distributionDate || '').getTime())
      .slice(0, 6);

    return { total, received, pending, rate, activeAgents, trendChart, districtChart, recentActivity };
  }, [citizens, agents]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans print:bg-white print:p-0">
      {/* Print-only Official Header */}
      <div className="hidden print:block mb-10 border-b-2 border-slate-900 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ISHYIGA</h1>
            <p className="text-slate-600 font-semibold uppercase tracking-widest text-xs mt-1">Official Distribution Analytics Report</p>
          </div>
          <div className="text-right text-xs text-slate-500 font-medium">
            <p>Generated: {new Date().toLocaleString()}</p>
            <p>Reference: {Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time distribution intelligence dashboard</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportData}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Export CSV/Excel
          </button>
          <button 
            onClick={downloadPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all"
          >
            Download PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Registered" value={metrics.total} change="14.2%" isPositive={true} subtitle="Total citizen base" />
        <StatCard title="Successful Deliveries" value={metrics.received} change="21.5%" isPositive={true} subtitle="Confirmed distributions" />
        <StatCard title="Efficiency Rate" value={`${metrics.rate}%`} change="0.4%" isPositive={true} subtitle="Fulfillment ratio" />
        <StatCard title="Field Agents" value={metrics.activeAgents} change="2" isPositive={true} subtitle="Active on-ground personnel" />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800">Distribution Velocity</h2>
            <p className="text-xs text-slate-500">Activity volume tracked over the last 7 reporting days</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" className="print:!h-[250px]">
              <AreaChart data={metrics.trendChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" name="Distributions" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800">Geographic Spread</h2>
            <p className="text-xs text-slate-500">Top performing districts</p>
          </div>
          <div className="h-[300px] w-full flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%" className="print:!h-[250px]">
              <PieChart margin={{ bottom: 20 }}>
                <Pie
                  data={metrics.districtChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.districtChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Live Audit Trail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">District</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.recentActivity.map((citizen) => (
                <tr key={citizen.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{citizen.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{citizen.nationalId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{citizen.district}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{citizen.agentName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{citizen.distributionDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={citizen.status as any} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;