import React, { useState } from 'react';
import { Citizen } from '../data/mockData';
import { StatusBadge } from './StatusBadge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface CitizenTableProps {
  citizens: Citizen[];
}
export const CitizenTable = ({ citizens }: CitizenTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(citizens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCitizens = citizens.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">National ID</th>
              <th className="px-6 py-4 font-medium">Citizen Name</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Distribution Date</th>
              <th className="px-6 py-4 font-medium">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedCitizens.map((citizen) =>
            <tr
              key={citizen.id}
              className="hover:bg-slate-50 transition-colors">
              
                <td className="px-6 py-4 font-mono text-slate-600">
                  {citizen.nationalId}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {citizen.name}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex flex-col">
                    <span>
                      {citizen.district}, {citizen.sector}
                    </span>
                    <span className="text-xs text-slate-400">
                      {citizen.cell}, {citizen.village}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={citizen.status} />
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {citizen.distributionDate || '-'}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {citizen.agentName || '-'}
                </td>
              </tr>
            )}
            {paginatedCitizens.length === 0 &&
            <tr>
                <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500">
                
                  No citizen records found matching the current filters.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-900">{startIndex + 1}</span>{' '}
            to{' '}
            <span className="font-medium text-slate-900">
              {Math.min(startIndex + itemsPerPage, citizens.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-900">
              {citizens.length}
            </span>{' '}
            records
          </span>
          <div className="flex items-center gap-2">
            <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      }
    </div>);

};