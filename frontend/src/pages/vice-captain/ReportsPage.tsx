import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Eye, Clock, CheckCircle, Edit3, Plus } from 'lucide-react';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import type { VCReport } from '@/types/vice-captain.types';
import clsx from 'clsx';

const typeLabels: Record<string, string> = {
  ATTENDANCE_SUMMARY:  'Attendance Summary',
  PERFORMANCE_SUMMARY: 'Performance Summary',
  MATCH_PREP:          'Match Prep',
  WEEKLY:              'Weekly Report',
};

const typeColors: Record<string, string> = {
  ATTENDANCE_SUMMARY:  'bg-emerald-500/15 text-emerald-400',
  PERFORMANCE_SUMMARY: 'bg-violet-500/15 text-violet-400',
  MATCH_PREP:          'bg-amber-500/15 text-amber-400',
  WEEKLY:              'bg-cyan-500/15 text-cyan-400',
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  DRAFT:     { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', icon: <Edit3 size={10} /> },
  SUBMITTED: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <Clock size={10} /> },
  REVIEWED:  { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle size={10} /> },
};

const REPORT_TYPES = [
  { type: 'WEEKLY',              label: 'Weekly Team Report',        desc: 'Team activities, attendance, performance for the week' },
  { type: 'ATTENDANCE_SUMMARY',  label: 'Attendance Summary',        desc: 'Monthly attendance breakdown and analysis' },
  { type: 'PERFORMANCE_SUMMARY', label: 'Performance Summary',       desc: 'Team performance metrics and growth analysis' },
  { type: 'MATCH_PREP',          label: 'Match Preparation Report',  desc: 'Player availability and strategy notes for upcoming match' },
];

const ReportsPage: React.FC = () => {
  const { data: reports = [], isLoading } = useQuery({ queryKey: ['vc-reports'], queryFn: vcDashboardService.getReports });
  const [showGenerate, setShowGenerate] = useState(false);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const handleGenerate = async (type: string) => {
    setGeneratingType(type);
    await new Promise(r => setTimeout(r, 1200));
    setGeneratingType(null);
    alert(`${typeLabels[type]} generated! (Placeholder — PDF export will open in production)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Reports</h1>
          <p className="text-sm text-gray-400 mt-1">Generate and submit reports to Captain and Coach</p>
        </div>
        <button
          onClick={() => setShowGenerate(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Generate Report
        </button>
      </div>

      {/* Generate Panel */}
      {showGenerate && (
        <div className="bg-dark-800 border border-violet-500/30 rounded-2xl p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4">Select Report Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.type}
                onClick={() => handleGenerate(rt.type)}
                disabled={generatingType !== null}
                className="flex flex-col items-start p-4 rounded-xl bg-dark-900 border border-dark-700
                           hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-left group disabled:opacity-50"
              >
                <div className={clsx('text-xs font-bold px-2.5 py-1 rounded-full mb-2', typeColors[rt.type])}>
                  {generatingType === rt.type ? '⏳ Generating...' : typeLabels[rt.type]}
                </div>
                <p className="text-sm font-medium text-white">{rt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{rt.desc}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-gray-500 border border-dark-600">PDF (placeholder)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-gray-500 border border-dark-600">Excel (placeholder)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-700">
          <h3 className="text-sm font-semibold text-white">Report History</h3>
        </div>
        <div className="divide-y divide-dark-700">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-dark-800 animate-pulse" />)
            : reports.map(report => {
              const status = statusConfig[report.status] ?? statusConfig.DRAFT;
              return (
                <div key={report.id} className="p-5 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-white">{report.title}</p>
                          <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full border', typeColors[report.type])}>{typeLabels[report.type]}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{report.summary}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                          <span>Period: {report.period}</span>
                          <span>·</span>
                          <span>Generated: {report.generatedAt}</span>
                          <span>·</span>
                          <span>By: {report.generatedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={clsx('flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border', status.color)}>
                        {status.icon} {report.status}
                      </span>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors opacity-0 group-hover:opacity-100">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700/50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 text-center">
          📄 PDF and Excel export are placeholders. Connect to backend API to enable actual file generation.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
