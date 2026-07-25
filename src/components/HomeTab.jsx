import React, { useState, useEffect } from 'react';
import { 
  Scan, AlertTriangle, Flame, ShieldAlert, Sparkles, 
  TrendingUp, Activity, CloudRain, ChevronRight, Eye, 
  Radio, CheckCircle, MapPin, Zap, RefreshCw
} from 'lucide-react';
import { MOCK_USER, HYDERABAD_AQI, AI_INSIGHTS, MOCK_HAZARDS } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function HomeTab({ onNavigate, onOpenWeather, onOpenEmergency }) {
  const [stats, setStats] = useState({ scans: 0, reports: 0, hazards: 0, healthScore: 0 });

  // Animate stats counter on tab load
  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setStats({
        scans: Math.round(142 * progress),
        reports: Math.round(28 * progress),
        hazards: Math.round(54 * progress),
        healthScore: Number((94.2 * progress).toFixed(1))
      });
      if (frame >= totalFrames) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8 select-none">
      
      {/* 1. Greeting Header Banner */}
      <div className="relative rounded-[28px] p-5 glass-panel overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#00E5FF]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
              <span className="text-[11px] font-mono text-[#00E5FF] tracking-wider uppercase font-semibold">
                NEURAL CITY MATRIX • ONLINE
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#4ADE80]">{MOCK_USER.name}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Hyderabad Sentinel ID: <span className="text-gray-200 font-mono">HYD-9042-SENT</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00E5FF] to-[#4ADE80] shadow-lg shadow-[#00E5FF]/20">
            <img 
              src={MOCK_USER.avatar} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-[14px]" 
            />
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="grid grid-cols-2 gap-3 mt-5 relative z-10">
          <button
            onClick={() => { soundFx.playScanSound(); onNavigate('vision'); }}
            className="flex items-center justify-center space-x-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black font-bold text-xs shadow-lg shadow-[#00E5FF]/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Scan className="w-4 h-4 stroke-[2.5]" />
            <span>AI Quick Scan</span>
          </button>

          <button
            onClick={() => { soundFx.playAlertSound(); onOpenEmergency(); }}
            className="flex items-center justify-center space-x-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#C77DFF] text-white font-bold text-xs shadow-lg shadow-[#FF4D6D]/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* 2. Weather & AQI Gauge + Heat Warning Card */}
      <div 
        onClick={() => { soundFx.playClickSound(); onOpenWeather(); }}
        className="glass-panel-interactive p-4 cursor-pointer relative overflow-hidden group"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <CloudRain className="w-5 h-5 text-[#00E5FF]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">HYDERABAD WEATHER & AQI</span>
          </div>
          <span className="text-[11px] text-[#00E5FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Full Radar <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
            <p className="text-[10px] text-gray-400 uppercase font-mono">Temperature</p>
            <p className="text-xl font-extrabold text-white mt-1">{HYDERABAD_AQI.temp}°C</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">Feels {HYDERABAD_AQI.feelsLike}°C</p>
          </div>

          {/* Air Quality Index */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center relative overflow-hidden">
            <p className="text-[10px] text-gray-400 uppercase font-mono">AQI Index</p>
            <p className="text-xl font-extrabold text-[#4ADE80] mt-1">{HYDERABAD_AQI.score}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">{HYDERABAD_AQI.status}</p>
          </div>

          {/* Rainfall Probability */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
            <p className="text-[10px] text-gray-400 uppercase font-mono">Rain Risk</p>
            <p className="text-xl font-extrabold text-[#00E5FF] mt-1">78%</p>
            <p className="text-[9px] text-cyan-400 mt-0.5">In 2 Hours</p>
          </div>
        </div>

        {/* Severe Heat Warning Pill */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#FFC857]/10 border border-[#FFC857]/30 flex items-center space-x-2 text-xs text-[#FFC857]">
          <Flame className="w-4 h-4 flex-shrink-0 animate-pulse text-[#FFC857]" />
          <span className="text-[11px] truncate">{HYDERABAD_AQI.heatWarning}</span>
        </div>
      </div>

      {/* 3. Animated Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Scans Today */}
        <div className="glass-panel p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Today's Scans</span>
            <div className="p-1.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">{stats.scans}</p>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% vs yesterday
          </p>
        </div>

        {/* Reports Filed */}
        <div className="glass-panel p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Reports Filed</span>
            <div className="p-1.5 rounded-xl bg-[#4ADE80]/10 text-[#4ADE80]">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">{stats.reports}</p>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> 21 Verified & Resolved
          </p>
        </div>

        {/* Hazards Detected */}
        <div className="glass-panel p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Hazards Flagged</span>
            <div className="p-1.5 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#FF4D6D] mt-2 font-mono">{stats.hazards}</p>
          <p className="text-[10px] text-gray-400 mt-1">12 Pending Action</p>
        </div>

        {/* City Health Score */}
        <div className="glass-panel p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-gray-400 uppercase">City Health Index</span>
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] mt-2 font-mono">
            {stats.healthScore}%
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Optimal Sector Status</p>
        </div>

      </div>

      {/* 4. AI Insights Card */}
      <div className="glass-card-cyan p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00E5FF] animate-spin" />
            <h3 className="text-xs font-bold text-[#00E5FF] uppercase font-mono tracking-wider">HYDRA AI INSIGHT ENGINE</h3>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-mono">REALTIME</span>
        </div>

        <div className="space-y-2 mt-3">
          {AI_INSIGHTS.map((insight) => (
            <div key={insight.id} className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-xs flex items-start space-x-3">
              <div className={`p-1.5 rounded-xl mt-0.5 ${
                insight.severity === 'danger' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                insight.severity === 'warning' ? 'bg-[#FFC857]/20 text-[#FFC857]' : 'bg-[#4ADE80]/20 text-[#4ADE80]'
              }`}>
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white text-xs">{insight.title}</span>
                  <span className="text-[9px] text-gray-500 font-mono">{insight.time}</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{insight.description}</p>
                <span className="text-[9px] text-[#00E5FF] font-mono mt-1 inline-block">Dept: {insight.dept}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live City Activity & Hazard Feed */}
      <div className="glass-panel p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#4ADE80]" /> NEARBY HYDERABAD HAZARDS
          </h3>
          <button 
            onClick={() => onNavigate('maps')}
            className="text-[11px] text-[#00E5FF] hover:underline"
          >
            View Map
          </button>
        </div>

        <div className="space-y-2.5">
          {MOCK_HAZARDS.slice(0, 3).map((hazard) => (
            <div 
              key={hazard.id} 
              onClick={() => onNavigate('maps')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                  <img src={hazard.image} alt={hazard.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{hazard.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{hazard.location}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full inline-block mt-1 ${
                    hazard.severity === 'Critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' : 'bg-[#FFC857]/20 text-[#FFC857]'
                  }`}>
                    {hazard.severity} Severity • {hazard.confidence}% AI Match
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
