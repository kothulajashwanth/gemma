import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { ShieldCheck, X, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'
  const { user, isLoaded } = useUser();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-4 flex flex-col justify-center items-center overflow-y-auto select-none">
      
      {/* Modal Container */}
      <div className="w-full max-w-sm glass-panel p-5 relative space-y-4 border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.25)] my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <h2 className="text-lg font-extrabold text-white font-mono tracking-wider">
            HYDRA CLERK SECURE AUTH
          </h2>
          <p className="text-[11px] text-gray-400 font-mono">
            {mode === 'signIn' ? "Sign In via Official Clerk Auth Engine" : "Register Official District Sentinel Account"}
          </p>
        </div>

        {/* Clerk Sign In / Sign Up Component */}
        <div className="flex justify-center my-2">
          {mode === 'signIn' ? (
            <SignIn 
              appearance={{
                elements: {
                  card: "bg-black/80 border border-white/10 shadow-none text-white",
                  headerTitle: "text-white font-bold",
                  headerSubtitle: "text-gray-400",
                  socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                  formFieldLabel: "text-[#00E5FF] font-mono text-[10px]",
                  formFieldInput: "bg-black border border-white/20 text-white rounded-xl",
                  formButtonPrimary: "bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-bold"
                }
              }}
            />
          ) : (
            <SignUp 
              appearance={{
                elements: {
                  card: "bg-black/80 border border-white/10 shadow-none text-white",
                  headerTitle: "text-white font-bold",
                  headerSubtitle: "text-gray-400",
                  socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                  formFieldLabel: "text-[#00E5FF] font-mono text-[10px]",
                  formFieldInput: "bg-black border border-white/20 text-white rounded-xl",
                  formButtonPrimary: "bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-bold"
                }
              }}
            />
          )}
        </div>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-white/5">
          <button
            onClick={() => { 
              setMode(mode === 'signIn' ? 'signUp' : 'signIn'); 
              soundFx.playClickSound(); 
            }}
            className="text-xs text-gray-400 hover:text-[#00E5FF] transition-colors font-mono"
          >
            {mode === 'signIn' ? "Need a Sentinel account? Sign Up" : "Already registered? Sign In"}
          </button>
        </div>

      </div>

    </div>
  );
}
