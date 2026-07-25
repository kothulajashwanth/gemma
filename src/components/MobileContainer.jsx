import React, { useState } from 'react';
import { Smartphone, Monitor, Shield, Radio, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function MobileContainer({ children, soundEnabled, setSoundEnabled }) {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'fullscreen'

  const toggleSound = () => {
    const newState = soundFx.toggleAudio();
    setSoundEnabled(newState);
    if (newState) soundFx.playClickSound();
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col items-center justify-center p-0 md:p-4 selection:bg-[#00E5FF]/30 font-sans relative overflow-hidden">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4ADE80]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>

      {/* Top Desktop Frame Control Bar */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#4ADE80] flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
            <Shield className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white flex items-center gap-2">
              HYDRA OS <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">v4.2 PROT</span>
            </h1>
            <p className="text-[11px] text-gray-400">Urban Intelligence Platform • Hyderabad Sector</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-[11px]">HYD-NEURAL GRID ONLINE</span>
          </div>

          <button 
            onClick={toggleSound}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all"
            title="Toggle Audio Effects"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            <span className="text-[11px]">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Toggle Device Preview Mode */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setDeviceMode('mobile'); soundFx.playClickSound(); }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-semibold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Frame</span>
            </button>
            <button
              onClick={() => { setDeviceMode('fullscreen'); soundFx.playClickSound(); }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'fullscreen'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-semibold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <div 
        className={`w-full transition-all duration-300 relative ${
          deviceMode === 'mobile'
            ? 'max-w-[420px] h-[860px] max-h-[92vh] rounded-[48px] border-[10px] border-[#161f2c] shadow-[0_0_60px_rgba(0,229,255,0.15)] ring-1 ring-white/20'
            : 'max-w-6xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl'
        } bg-[#05070A] overflow-hidden flex flex-col`}
      >
        {/* Dynamic Island / Mobile Camera Notch Header (Only in Mobile Frame) */}
        {deviceMode === 'mobile' && (
          <div className="w-full bg-[#05070A] pt-3 pb-1 px-6 flex justify-between items-center z-50 select-none">
            <span className="text-[12px] font-semibold text-white font-mono tracking-tight">09:41</span>
            {/* Dynamic Cyber Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center space-x-2 px-2 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-gray-300 font-mono">
              <span className="text-[10px] text-[#00E5FF]">5G</span>
              <div className="w-5 h-2.5 border border-white/60 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-[#4ADE80] rounded-xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Viewport Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-[#05070A]">
          {children}
        </div>
      </div>

    </div>
  );
}
