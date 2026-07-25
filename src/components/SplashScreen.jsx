import React, { useEffect, useState } from 'react';
import { Shield, Cpu, Activity, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState("HYDRA NEURAL ENGINE INITIALIZING...");
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    // Trigger boot sound effect
    soundFx.playBootSound();

    const textSteps = [
      { p: 20, text: "CONNECTING HYDERABAD IoT SENSOR MESH..." },
      { p: 45, text: "CALIBRATING VISION AI NEURAL CORE..." },
      { p: 70, text: "SYNCING DISASTER MANAGEMENT DISPATCH..." },
      { p: 90, text: "HYDRA URBAN OS READY." },
      { p: 100, text: "AUTHENTICATED — SENTINEL JASHWANTH" }
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        const currentStep = textSteps.find(s => s.p === next);
        if (currentStep) {
          setBootText(currentStep.text);
        }
        if (next >= 50 && !taglineVisible) {
          setTaglineVisible(true);
        }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 600);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#05070A] z-50 flex flex-col items-center justify-between p-8 overflow-hidden select-none select-none">
      
      {/* Background Cybernetic Grid & Animated Scanline */}
      <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
      <div className="scanline absolute inset-0 pointer-events-none opacity-40"></div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent absolute top-0 animate-scan"></div>

      {/* Top OS Watermark */}
      <div className="pt-6 flex items-center space-x-2 text-xs font-mono text-[#00E5FF]/70 tracking-widest uppercase">
        <Cpu className="w-4 h-4 animate-spin text-[#00E5FF]" />
        <span>HYDRA AI ARCHITECTURE • SEC-LEVEL 5</span>
      </div>

      {/* Center Logo & Tagline */}
      <div className="flex flex-col items-center text-center my-auto relative">
        
        {/* Glowing Animated Logo Frame */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] rounded-full blur-2xl opacity-40 animate-pulse"></div>
          
          <div className="w-28 h-28 bg-[#05070A] border-2 border-[#00E5FF]/60 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.3)] relative overflow-hidden">
            {/* Hexagon Cyber Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,229,255,0.1)_25%,transparent_25%,transparent_50%,rgba(0,229,255,0.1)_50%,rgba(0,229,255,0.1)_75%,transparent_75%,transparent)] bg-[length:12px_12px] opacity-30"></div>
            
            <Shield className="w-14 h-14 text-[#00E5FF] stroke-[1.8] filter drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
            
            {/* Animated Laser Scanning Line over Logo */}
            <div className="absolute inset-x-0 h-1 bg-[#00E5FF] shadow-[0_0_15px_#00E5FF] animate-scan"></div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold tracking-widest text-white font-sans uppercase mb-2">
          HYDRA <span className="text-[#00E5FF]">OS</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono tracking-widest mb-6">URBAN INTELLIGENCE PLATFORM</p>

        {/* Tagline Reveal */}
        <div className={`transition-all duration-700 transform ${taglineVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
            <span className="text-sm font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#4ADE80]">
              See. Analyze. Protect.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Sequence */}
      <div className="w-full max-w-sm pb-6">
        <div className="flex justify-between items-center text-[11px] font-mono mb-2">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            {bootText}
          </span>
          <span className="text-[#00E5FF] font-bold">{progress}%</span>
        </div>

        {/* Cyber Progress Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full p-0.5 border border-white/10 relative overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] shadow-[0_0_12px_#00E5FF] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="mt-4 text-center text-[10px] font-mono text-gray-500 tracking-wider">
          HYDERABAD MUNICIPAL AI ENGINE • ENCRYPTED CONNECTION
        </div>
      </div>

    </div>
  );
}
