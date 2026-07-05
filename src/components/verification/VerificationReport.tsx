import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, Download } from 'lucide-react';
import { VerificationReport as ReportType } from '../../services/verification';

interface VerificationReportProps {
  report: ReportType;
  targetName: string;
}

export const VerificationReport: React.FC<VerificationReportProps> = ({ report, targetName }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warn': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 rounded-full bg-gray-200" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold">Verification Report</h2>
              <p className="text-slate-400 text-sm">ID: {report.id} • {new Date(report.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${report.overallScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {report.overallScore}/100
            </div>
            <div className="text-slate-400 text-xs uppercase tracking-wider">Trust Score</div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-6 border-b border-gray-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Agent Summary</h3>
        <p className="text-gray-700 leading-relaxed italic">
          "{report.aiAnalysis}"
        </p>
      </div>

      {/* Detailed Checks */}
      <div className="p-6 grid gap-6">
        {Object.entries(report.checks).map(([key, check]) => (
          <div key={key} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="mt-1">{getStatusIcon(check.status)}</div>
            <div>
              <h4 className="font-semibold text-gray-900 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()} Check
              </h4>
              <p className="text-gray-600 text-sm">{check.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          This report is generated based on public records and AI analysis. 
          It does not constitute a legal background check.
        </p>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};
