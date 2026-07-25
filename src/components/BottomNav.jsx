import React from 'react';
import { Home, Camera, Map, FileText, User, Bot, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function BottomNav({ activeTab, setActiveTab, onOpenVoiceAssistant }) {

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'vision', label: 'Vision', icon: Camera },
    // Center is AI Action Button slot
    { id: 'maps', label: 'Maps', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleTabClick = (tabId) => {
    soundFx.playClickSound();
    setActiveTab(tabId);
  };

  return (
    <div className="relative z-40 px-3 pb-3 pt-1 select-none">
      
      {/* Floating Glass Container */}
      <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-1.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        
        {/* Left Side: Home & Vision */}
        <div className="flex items-center space-x-1 flex-1 justify-around">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-gradient-to-b from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </button>

          <button
            onClick={() => handleTabClick('vision')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
              activeTab === 'vision'
                ? 'bg-gradient-to-b from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Vision</span>
          </button>
        </div>

        {/* Center Animated Floating AI Action Orb */}
        <div className="relative -top-5 px-2">
          <button
            onClick={() => { soundFx.playScanSound(); onOpenVoiceAssistant(); }}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] p-0.5 shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:shadow-[0_0_40px_rgba(0,229,255,0.9)] transition-all duration-300 transform active:scale-95"
            title="HYDRA AI Voice Assistant"
          >
            {/* Outer Glowing Ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] blur-md opacity-75 group-hover:opacity-100 animate-pulse"></div>
            
            {/* Inner Cyber Core */}
            <div className="relative w-full h-full bg-[#05070A] rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
              <Bot className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform duration-200" />
              <Sparkles className="w-3 h-3 text-[#4ADE80] absolute top-2 right-2 animate-ping" />
            </div>
          </button>
        </div>

        {/* Right Side: Maps, Reports, Profile */}
        <div className="flex items-center space-x-1 flex-1 justify-around">
          <button
            onClick={() => handleTabClick('maps')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
              activeTab === 'maps'
                ? 'bg-gradient-to-b from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Maps</span>
          </button>

          <button
            onClick={() => handleTabClick('reports')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-b from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Reports</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-b from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}
