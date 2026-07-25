import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Key, UserCheck, Sparkles, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sentinelCode, setSentinelCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.playSuccessSound();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: email || "sentinel@hydra-os.hyderabad.gov.in",
        name: email ? email.split('@')[0].toUpperCase() : "JASHWANTH (SENTINEL #9042)",
        role: "Level 4 Cyberabad District Sentinel"
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-6 flex flex-col justify-center items-center animate-fadeIn select-none">
      
      {/* Modal Container */}
      <div className="w-full max-w-sm glass-panel p-6 relative space-y-5 border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <ShieldCheck className="w-8 h-8 text-[#00E5FF]" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-mono tracking-wider">
            HYDRA OS AUTHENTICATION
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            {isSignUp ? "Register New Sentinel Credentials" : "Sign In to Hyderabad Urban Intelligence Grid"}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-[#00E5FF] uppercase">SENTINEL EMAIL ADDRESS</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@hyderabad.gov.in"
                className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-[#00E5FF] uppercase">ENCRYPTED PASSCODE</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-[10px] font-mono text-[#4ADE80] uppercase">DISTRICT SENTINEL CODE (OPTIONAL)</label>
              <div className="relative mt-1">
                <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={sentinelCode}
                  onChange={(e) => setSentinelCode(e.target.value)}
                  placeholder="HYD-DISTRICT-9042"
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-[#4ADE80] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> VERIFYING CLERK AUTH...
              </span>
            ) : (
              <>
                <span>{isSignUp ? "INITIALIZE SENTINEL ACCOUNT" : "AUTHENTICATE & LOG IN"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-white/5">
          <button
            onClick={() => { setIsSignUp(!isSignUp); soundFx.playClickSound(); }}
            className="text-xs text-gray-400 hover:text-[#00E5FF] transition-colors"
          >
            {isSignUp ? "Already registered? Sign In instead" : "Need access? Register New Sentinel Account"}
          </button>
        </div>

      </div>

    </div>
  );
}
