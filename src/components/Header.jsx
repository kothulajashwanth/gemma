import React, { useState, useEffect } from 'react';
import { Shield, Bell, CloudSun, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';
import { HYDERABAD_AQI } from '../utils/mockData';

export default function Header({ onOpenNotifications, onOpenWeather, soundEnabled, setSoundEnabled, unreadCount }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    const newState = soundFx.toggleAudio();
    setSoundEnabled(newState);
    if (newState) soundFx.playClickSound();
  };

  return (
    <header className="px-5 py-3.5 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-30 select-none">
      
      {/* Brand Identity */}
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#4ADE80] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <div className="w-full h-full bg-[#05070A] rounded-[10px] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 font-sans leading-none">
            HYDRA <span className="text-[#00E5FF] text-xs font-mono font-normal px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">OS</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono tracking-tight flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            HYDERABAD GRID • {timeStr}
          </p>
        </div>
      </div>

      {/* Quick Action Widgets */}
      <div className="flex items-center space-x-2">
        
        {/* Quick Weather Badge */}
        <button
          onClick={() => { soundFx.playClickSound(); onOpenWeather(); }}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-all active:scale-95"
          title="Hyderabad Weather & AQI"
        >
          <CloudSun className="w-4 h-4 text-[#FFC857]" />
          <span className="font-semibold text-white">{HYDERABAD_AQI.temp}°C</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">AQI {HYDERABAD_AQI.score}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all active:scale-95"
          title={soundEnabled ? "Audio On" : "Audio Muted"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Notification Drawer Trigger */}
        <button
          onClick={() => { soundFx.playClickSound(); onOpenNotifications(); }}
          className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all active:scale-95"
          title="Notification Center"
        >
          <Bell className="w-4 h-4 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4D6D] text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-[#FF4D6D]/50 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
}
