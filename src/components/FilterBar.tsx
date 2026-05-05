import React from 'react';
import { Search, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Citizen } from '../data/mockData';
import { escapeCsvValue } from '../utils/csv';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  districtFilter: string;
  setDistrictFilter: (district: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  districts: string[];
  data: Citizen[];
}
export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  districtFilter,
  setDistrictFilter,
  statusFilter,
  setStatusFilter,
  districts,
  data
}: FilterBarProps) => {
  const handleExport = (type: string) => {
    if (type === 'PDF') {
      const originalTitle = document.title;
      const date = new Date().toISOString().split('T')[0];
      document.title = `Ishyiga_Distribution_Report_${date}`;
      window.print();
      document.title = originalTitle;
      return;
    }
    const headers = ['National ID', 'Name', 'Province', 'District', 'Sector', 'Cell', 'Village', 'Status', 'Date', 'Agent']; // 10 headers

    const rows = data.map(c => [
      `'${c.nationalId}`,
      escapeCsvValue(c.name),
      escapeCsvValue(c.province),
      escapeCsvValue(c.district),
      escapeCsvValue(c.sector),
      escapeCsvValue(c.cell),
      escapeCsvValue(c.village),
      c.status,
      c.distributionDate || 'N/A',
      escapeCsvValue(c.agentName)
    ]);

    const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ishyiga_citizens_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${type} Report generated successfully`);
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
          
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
          
          <option value="">All Districts</option>
          {districts.map((d) =>
          <option key={d} value={d}>
              {d}
            </option>
          )}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
          
          <option value="">All Statuses</option>
          <option value="Received">Received</option>
          <option value="Not Received">Not Received</option>
        </select>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto">
        <button
          onClick={() => handleExport('CSV')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          
          <Download size={16} />
          <span className="hidden sm:inline">CSV</span>
        </button>
        <button
          onClick={() => handleExport('Excel')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          
          <FileSpreadsheet size={16} />
          <span className="hidden sm:inline">Excel</span>
        </button>
        <button
          onClick={() => handleExport('PDF')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          
          <FileText size={16} />
          <span className="hidden sm:inline">PDF</span>
        </button>
      </div>
    </div>);

};