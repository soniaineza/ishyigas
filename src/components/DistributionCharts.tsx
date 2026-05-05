import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend } from
'recharts';
import { useData } from '../context/DataContext';
export const DistrictDistributionChart = () => {
  const { citizens } = useData();
  const data = useMemo(() => {
    const districtCounts: Record<
      string,
      {
        received: number;
        total: number;
      }> =
    {};
    citizens.forEach((c) => {
      if (!districtCounts[c.district]) {
        districtCounts[c.district] = {
          received: 0,
          total: 0
        };
      }
      districtCounts[c.district].total += 1;
      if (c.status === 'Received') {
        districtCounts[c.district].received += 1;
      }
    });
    return Object.entries(districtCounts).
    map(([name, counts]) => ({
      name,
      Received: counts.received,
      Pending: counts.total - counts.received
    })).
    sort((a, b) => b.Received + b.Pending - (a.Received + a.Pending)).
    slice(0, 8); // Top 8 districts
  }, [citizens]);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Distribution by District
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -20,
            bottom: 0
          }}>
          
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0" />
          
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12
            }}
            dy={10} />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12
            }} />
          
          <Tooltip
            cursor={{
              fill: '#f1f5f9'
            }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }} />
          
          <Legend
            wrapperStyle={{
              paddingTop: '20px'
            }} />
          
          <Bar
            dataKey="Received"
            stackId="a"
            fill="#16a34a"
            radius={[0, 0, 4, 4]} />
          
          <Bar
            dataKey="Pending"
            stackId="a"
            fill="#94a3b8"
            radius={[4, 4, 0, 0]} />
          
        </BarChart>
      </ResponsiveContainer>
    </div>);

};
export const DailyActivityChart = () => {
  const { citizens } = useData();
  const data = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    // Get last 14 days
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dailyCounts[d.toISOString().split('T')[0]] = 0;
    }
    citizens.forEach((c) => {
      if (c.status === 'Received' && c.distributionDate) {
        if (dailyCounts[c.distributionDate] !== undefined) {
          dailyCounts[c.distributionDate] += 1;
        }
      }
    });
    return Object.entries(dailyCounts).map(([date, count]) => {
      const d = new Date(date);
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        Distributions: count
      };
    });
  }, [citizens]);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Daily Distribution Activity
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -20,
            bottom: 0
          }}>
          
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0" />
          
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12
            }}
            dy={10} />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12
            }} />
          
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }} />
          
          <Line
            type="monotone"
            dataKey="Distributions"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: '#2563eb',
              strokeWidth: 2,
              stroke: '#fff'
            }}
            activeDot={{
              r: 6,
              fill: '#2563eb',
              strokeWidth: 0
            }} />
          
        </LineChart>
      </ResponsiveContainer>
    </div>);

};