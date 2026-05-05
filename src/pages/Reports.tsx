import React from 'react';
import { FileText, Download, BarChart3, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '../context/DataContext';
import { escapeCsvValue } from '../utils/csv';

export const Reports = () => {
  const { citizens, agents } = useData();

  const handleDownload = (reportName: string, type: string) => {
    toast.info(`Generating ${reportName}...`);
    
    if (type === 'CSV') {
      // CSV Export for Raw Data
      const headers = ['National ID', 'Name', 'Province', 'District', 'Sector', 'Status', 'Date', 'Agent'];
      const rows = citizens.map(c => [
        `'${c.nationalId}`,
        escapeCsvValue(c.name),
        escapeCsvValue(c.province),
        escapeCsvValue(c.district),
        escapeCsvValue(c.sector),
        c.status,
        c.distributionDate || 'N/A',
        escapeCsvValue(c.agentName)
      ]);

      const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ishyiga_raw_data_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (type === 'Excel') {
      // Excel/CSV Export for Agent Performance Metrics
      const headers = ['Agent Name', 'Status', 'Citizens Served', 'Registration Rate', 'Active'];
      const rows = agents.map(a => {
        const served = citizens.filter(c => c.agentName === a.name && c.status === 'Received').length;
        const total = citizens.filter(c => c.agentName === a.name).length;
        const rate = total > 0 ? ((served / total) * 100).toFixed(1) : '0';
        return [
          escapeCsvValue(a.name),
          a.status,
          served,
          `${rate}%`,
          a.status === 'active' ? 'Yes' : 'No'
        ];
      });

      const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ishyiga_agent_performance_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (type === 'PDF') {
      // Print/PDF for Monthly Distribution Summary or Demographic Analysis
      const originalTitle = document.title;
      const date = new Date().toISOString().split('T')[0];
      document.title = `${reportName}_${date}`;
      setTimeout(() => {
        window.print();
        document.title = originalTitle;
      }, 100);
    }
    
    setTimeout(() => {
      toast.success(`${reportName} downloaded successfully`);
    }, 1500);
  };
  const reports = [
  {
    title: 'Monthly Distribution Summary',
    description:
    'Comprehensive overview of all distributions across districts for the current month.',
    icon: BarChart3,
    type: 'PDF'
  },
  {
    title: 'Agent Performance Metrics',
    description:
    'Detailed statistics on agent activity, including citizens served and registration rates.',
    icon: FileText,
    type: 'Excel'
  },
  {
    title: 'Demographic Analysis',
    description:
    'Breakdown of registered citizens by age, location, and distribution status.',
    icon: PieChart,
    type: 'PDF'
  },
  {
    title: 'Raw Data Export',
    description:
    'Complete dataset of all citizens and agents for custom analysis.',
    icon: Download,
    type: 'CSV'
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
        <p className="text-slate-500 mt-1">
          Generate and download comprehensive system reports and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) =>
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <report.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {report.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {report.description}
                </p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
              <button
              onClick={() => handleDownload(report.title, report.type)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              
                <Download size={16} />
                Download {report.type}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

};