import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Scan, AlertTriangle, Flame, ShieldAlert, Sparkles, 
  TrendingUp, Activity, CloudRain, ChevronRight, Eye, 
  Radio, CheckCircle, MapPin, Zap, RefreshCw
} from 'lucide-react';
import { MOCK_USER, HYDERABAD_AQI, AI_INSIGHTS, MOCK_HAZARDS } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function HomeTab({ onNavigate, onOpenWeather, onOpenEmergency }) {
  const [stats, setStats] = useState({ scans: 0, reports: 0, hazards: 0, healthScore: 0 });
  const { user: clerkUser, isSignedIn } = useUser();

  const userName = isSignedIn && clerkUser
    ? (clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0].toUpperCase())
    : MOCK_USER.name;

  const userAvatar = isSignedIn && clerkUser
    ? clerkUser.imageUrl
    : MOCK_USER.avatar;

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
              Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#4ADE80]">{userName}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Hyderabad Sentinel ID: <span className="text-gray-200 font-mono">HYD-9042-SENT</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00E5FF] to-[#4ADE80] shadow-lg shadow-[#00E5FF]/20">
            <img 
              src={userAvatar} 
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
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <p className="text-[10px] text-gray-400 font-mono uppercase">TEMP</p>
            <p className="text-lg font-extrabold text-white font-mono mt-0.5">{HYDERABAD_AQI.temp}°C</p>
            <p className="text-[9px] text-[#FFC857] mt-0.5">RealFeel 34°</p>
          </div>

          {/* Air Quality Index */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <p className="text-[10px] text-gray-400 font-mono uppercase">AQI INDEX</p>
            <p className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">{HYDERABAD_AQI.score}</p>
            <p className="text-[9px] text-emerald-400 mt-0.5">{HYDERABAD_AQI.status}</p>
          </div>

          {/* Humidity */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <p className="text-[10px] text-gray-400 font-mono uppercase">HUMIDITY</p>
            <p className="text-lg font-extrabold text-[#00E5FF] font-mono mt-0.5">{HYDERABAD_AQI.humidity}%</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Monsoon Surge</p>
          </div>
        </div>
      </div>

      {/* 3. Realtime City Health Gauge Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-4 flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">HYD HEALTH SCORE</p>
            <p className="text-xl font-extrabold text-white font-mono">{stats.healthScore}%</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> Optimal Operations
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">SCANS PERFORMED</p>
            <p className="text-xl font-extrabold text-white font-mono">{stats.scans}</p>
            <p className="text-[10px] text-gray-400 font-mono">Today across 30 circles</p>
          </div>
        </div>
      </div>

      {/* 4. Live AI Predictive Urban Insights Carousel */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" /> AI PREDICTIVE URBAN TELEMETRY
          </h3>
          <span className="text-[10px] text-[#00E5FF] font-mono">REALTIME FEED</span>
        </div>

        <div className="space-y-2.5">
          {AI_INSIGHTS.map((insight) => (
            <div 
              key={insight.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/50 transition-all flex items-start space-x-3"
            >
              <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-[#00E5FF] flex-shrink-0 mt-0.5">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white truncate">{insight.title}</h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                    {insight.confidence}% Match
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-snug">{insight.desc}</p>
                <div className="flex items-center space-x-3 mt-2 text-[10px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1 text-[#00E5FF]">
                    <MapPin className="w-3 h-3" /> {insight.area}
                  </span>
                  <span>•</span>
                  <span>Impact: {insight.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
