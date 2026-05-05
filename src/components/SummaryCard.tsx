import React from 'react';
import { BoxIcon } from 'lucide-react';
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}
export const SummaryCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-blue-600 bg-blue-50'
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend &&
        <span
          className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        }
      </div>
    </div>);

};