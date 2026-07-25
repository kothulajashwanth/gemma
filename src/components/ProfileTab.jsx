import React, { useState } from 'react';
import { 
  User, ShieldCheck, Award, Eye, FileText, CheckCircle2, 
  Moon, Volume2, Globe, Lock, LogOut, ChevronRight, Sparkles, Cpu, Bell
} from 'lucide-react';
import { MOCK_USER } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function ProfileTab({ soundEnabled, setSoundEnabled, onLogout }) {
  const [oledMode, setOledMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const toggleSound = () => {
    const newState = soundFx.toggleAudio();
    setSoundEnabled(newState);
    if (newState) soundFx.playClickSound();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8 select-none">
      
      {/* 1. Header Profile Banner */}
      <div className="glass-panel p-5 relative overflow-hidden text-center">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF]"></div>
        
        {/* Avatar with Cyber Shield Badge */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#00E5FF] to-[#4ADE80] rounded-full blur-md opacity-70 animate-pulse"></div>
          <img 
            src={MOCK_USER.avatar} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover rounded-full border-2 border-white relative z-10" 
          />
          <div className="absolute bottom-0 right-0 z-20 w-6 h-6 rounded-full bg-[#00E5FF] text-black flex items-center justify-center border-2 border-[#05070A]">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-white">{MOCK_USER.name}</h2>
        <p className="text-xs text-[#00E5FF] font-mono mt-0.5">{MOCK_USER.level}</p>
        <p className="text-[11px] text-gray-400 font-mono">{MOCK_USER.rank}</p>

        {/* Radial Citizen Score Gauge */}
        <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-around">
          <div className="text-left">
            <span className="text-[10px] font-mono text-gray-400 uppercase">CITIZEN IMPACT SCORE</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] font-mono">
                {MOCK_USER.score}
              </span>
              <span className="text-xs text-gray-400 font-mono">/ 100</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-0.5">Top 1% Sentinel in Hyderabad</p>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-[#00E5FF] flex items-center justify-center bg-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <Sparkles className="w-6 h-6 text-[#00E5FF] animate-spin" />
          </div>
        </div>
      </div>

      {/* 2. Sentinel Activity Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-panel p-3 text-center">
          <Eye className="w-4 h-4 text-[#00E5FF] mx-auto mb-1" />
          <p className="text-lg font-extrabold text-white font-mono">{MOCK_USER.totalScans}</p>
          <p className="text-[9px] text-gray-400 uppercase font-mono">AI Scans</p>
        </div>

        <div className="glass-panel p-3 text-center">
          <FileText className="w-4 h-4 text-[#4ADE80] mx-auto mb-1" />
          <p className="text-lg font-extrabold text-white font-mono">{MOCK_USER.reportsSubmitted}</p>
          <p className="text-[9px] text-gray-400 uppercase font-mono">Reports</p>
        </div>

        <div className="glass-panel p-3 text-center">
          <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-extrabold text-white font-mono">{MOCK_USER.hazardsResolved}</p>
          <p className="text-[9px] text-gray-400 uppercase font-mono">Resolved</p>
        </div>
      </div>

      {/* 3. Achievements & Badges */}
      <div className="glass-panel p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#FFC857]" /> CITIZEN BADGES & HONORS
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">4 UNLOCKED</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {MOCK_USER.badges.map((b) => (
            <div key={b.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start space-x-2.5">
              <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-snug">{b.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Settings & Preferences Menu */}
      <div className="glass-panel p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          SYSTEM PREFERENCES
        </h3>

        <div className="space-y-2">
          {/* OLED Mode */}
          <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs text-white">OLED Ultra Black Mode</span>
            </div>
            <button
              onClick={() => { setOledMode(!oledMode); soundFx.playClickSound(); }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                oledMode ? 'bg-[#00E5FF]' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                oledMode ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Audio & Haptic Feedback */}
          <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-4 h-4 text-[#4ADE80]" />
              <span className="text-xs text-white">Sci-Fi Audio & Haptics</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#4ADE80]' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Language Selector */}
          <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white">Interface Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); soundFx.playClickSound(); }}
              className="bg-black text-xs text-[#00E5FF] font-mono px-2 py-1 rounded-xl border border-white/10 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Privacy & Encryption */}
          <div 
            onClick={() => { soundFx.playClickSound(); alert("HYDRA OS End-to-End Encryption enabled. Zero logs kept."); }}
            className="p-3 rounded-2xl bg-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-[#FFC857]" />
              <span className="text-xs text-white">Privacy & Data Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* 5. Logout Button */}
      <button
        onClick={() => { soundFx.playAlertSound(); onLogout(); }}
        className="w-full py-3.5 rounded-2xl bg-[#FF4D6D]/15 hover:bg-[#FF4D6D]/25 border border-[#FF4D6D]/40 text-[#FF4D6D] font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        <span>LOCK & DISCONNECT HYDRA SESSION</span>
      </button>

    </div>
  );
}
