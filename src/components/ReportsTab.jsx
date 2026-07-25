import React, { useState } from 'react';
import { 
  FileText, Search, Filter, CheckCircle2, Clock, 
  AlertCircle, ChevronDown, ChevronUp, MapPin, ThumbsUp, Share2, Sparkles, Building2
} from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function ReportsTab({ reports, onUpvoteReport }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'upvotes'
  const [expandedReportId, setExpandedReportId] = useState(null);

  // Status Colors Mapping
  const statusStyles = {
    Submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', icon: Clock },
    Assigned: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40', icon: Building2 },
    'In Progress': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', icon: AlertCircle },
    Resolved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', icon: CheckCircle2 }
  };

  // Filter & Sort Logic
  const filteredReports = reports.filter(r => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    return new Date(b.date) - new Date(a.date);
  });

  const toggleExpand = (id) => {
    soundFx.playClickSound();
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Civic Intelligence Timeline <FileText className="w-5 h-5 text-[#00E5FF]" />
          </h2>
          <p className="text-xs text-gray-400 font-mono">Live HYDRA Dispatch & Resolution Ledger</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold">
          {filteredReports.length} REPORTS
        </span>
      </div>

      {/* Search & Sort controls */}
      <div className="space-y-2">
        <div className="glass-panel p-2 flex items-center space-x-2 border border-white/10">
          <Search className="w-4 h-4 text-[#00E5FF] ml-2" />
          <input 
            type="text" 
            placeholder="Filter by keyword, location, or dept..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none py-1"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-none py-1">
          {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => { setFilterStatus(st); soundFx.playClickSound(); }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-bold border-transparent shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List of Civic Reports */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const stInfo = statusStyles[report.status] || statusStyles.Submitted;
          const StatusIcon = stInfo.icon;
          const isExpanded = expandedReportId === report.id;

          return (
            <div 
              key={report.id}
              className="glass-panel-interactive p-4 relative overflow-hidden transition-all duration-200"
            >
              {/* Top Row: Category, Date & Status Badge */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-gray-400 font-bold tracking-wider">
                    {report.id}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-[11px] text-[#00E5FF] font-semibold">
                    {report.category}
                  </span>
                </div>

                <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 ${stInfo.bg} ${stInfo.text} ${stInfo.border}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{report.status}</span>
                </div>
              </div>

              {/* Main Content Info */}
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg">
                  <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{report.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {report.location}
                  </p>
                  <p className="text-[10px] font-mono text-gray-500">Dept: {report.dept}</p>
                </div>
              </div>

              {/* Expand Toggle Trigger */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs">
                  <button 
                    onClick={() => { onUpvoteReport(report.id); soundFx.playClickSound(); }}
                    className="flex items-center space-x-1 text-gray-300 hover:text-[#4ADE80] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">{report.upvotes}</span>
                  </button>

                  <button 
                    onClick={() => { soundFx.playClickSound(); alert(`Share link for ${report.id} copied to clipboard!`); }}
                    className="flex items-center space-x-1 text-gray-400 hover:text-[#00E5FF] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Share</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleExpand(report.id)}
                  className="text-xs text-[#00E5FF] font-medium flex items-center space-x-1 hover:underline"
                >
                  <span>{isExpanded ? 'Hide Details' : 'Timeline Progress'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expandable Resolution Timeline & Evidence Detail */}
              {isExpanded && (
                <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-white/10 space-y-3 animate-fadeIn">
                  <p className="text-xs text-gray-300 leading-relaxed">{report.description}</p>
                  
                  {/* Step Progress Tracker Bar */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[10px] font-mono text-gray-400 uppercase font-bold">DISPATCH TIMELINE PROGRESS:</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[9px]">1</div>
                        <span className="text-white font-medium">Verified by Vision AI Engine</span>
                        <span className="text-[9px] text-gray-500 font-mono ml-auto">09:00 AM</span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                          report.status !== 'Submitted' ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-400'
                        }`}>2</div>
                        <span className={report.status !== 'Submitted' ? 'text-white' : 'text-gray-500'}>Assigned to {report.dept}</span>
                        <span className="text-[9px] text-gray-500 font-mono ml-auto">09:45 AM</span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                          report.status === 'Resolved' ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-400'
                        }`}>3</div>
                        <span className={report.status === 'Resolved' ? 'text-white' : 'text-gray-500'}>Field Verification & Closure</span>
                        <span className="text-[9px] text-gray-500 font-mono ml-auto">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
