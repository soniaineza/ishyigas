import React from 'react';
import { CheckCircle2, XCircle, PauseCircle, Ban } from 'lucide-react';
interface StatusBadgeProps {
  status:
  'Received' |
  'Not Received' |
  'active' |
  'inactive' |
  'suspended' |
  'disabled';
}
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === 'Received' || status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircle2 size={14} />
        {status}
      </span>);

  }
  if (status === 'suspended') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <PauseCircle size={14} />
        Suspended
      </span>);

  }
  if (status === 'disabled' || status === 'inactive') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
        <Ban size={14} />
        Disabled
      </span>);

  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
      <XCircle size={14} />
      {status}
    </span>);

};