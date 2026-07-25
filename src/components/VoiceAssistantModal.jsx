import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Bot, Sparkles, Send, Volume2, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';

export default function VoiceAssistantModal({ onClose, onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "HYDRA OS Neural Assistant online. How can I assist you with Hyderabad urban operations today?"
    }
  ]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Dynamic Audio Waveform Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let step = 0;

    const renderWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00E5FF';

      for (let x = 0; x < width; x++) {
        const amplitude = isListening ? 35 : 12;
        const frequency = isListening ? 0.08 : 0.04;
        const y = centerY + Math.sin(x * frequency + step) * amplitude * Math.cos(x * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second glowing emerald wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4ADE80';
      for (let x = 0; x < width; x++) {
        const amplitude = isListening ? 25 : 8;
        const frequency = isListening ? 0.06 : 0.03;
        const y = centerY + Math.sin(x * frequency - step) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += isListening ? 0.15 : 0.05;
      animationFrameRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isListening]);

  // Handle Speech Recognition or Quick Chip Prompts
  const handleQuery = (queryText) => {
    soundFx.playClickSound();
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);

    // Speak synthetic response
    const speakText = (text) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    };

    setTimeout(() => {
      let aiReply = "Processing your query across Hyderabad sensor mesh...";
      const lower = queryText.toLowerCase();

      if (lower.includes('pothole') || lower.includes('report')) {
        aiReply = "Navigating to Vision AI Camera Scanner. Point your lens at the pothole to calculate depth & severity.";
        onNavigate('vision');
        onClose();
      } else if (lower.includes('flood') || lower.includes('water')) {
        aiReply = "Active inundation flagged at Begumpet Railway Underpass & Hussain Sagar Link Road. HYDRA pumps active.";
        onNavigate('maps');
      } else if (lower.includes('weather') || lower.includes('rain')) {
        aiReply = "Hyderabad current temperature is 31°C. Convective rain expected in 2 hours with 78% probability.";
      } else if (lower.includes('hospital') || lower.includes('emergency')) {
        aiReply = "Nearest emergency facility: KIMS Hospital Begumpet (1.2 km away) & Yashoda Hospital Hitec City (2.4 km away). Dispatching emergency contact protocol.";
      } else {
        aiReply = `AI Analysis complete for "${queryText}". All 3,480 IoT city sensors report normal operation parameters.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      soundFx.playSuccessSound();
      speakText(aiReply);
    }, 800);
  };

  // Toggle Voice Input
  const toggleListening = () => {
    soundFx.playScanSound();
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      
      // Check for Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
          handleQuery(text);
        };
        recognition.onerror = () => {
          setIsListening(false);
        };
      } else {
        // Fallback simulation after 2 seconds
        setTimeout(() => {
          const samplePrompts = ["Report pothole in Jubilee Hills", "Nearby floods in Begumpet", "Weather forecast today"];
          const picked = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
          setTranscript(picked);
          setIsListening(false);
          handleQuery(picked);
        }, 2200);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-5 flex flex-col justify-between animate-fadeIn select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#4ADE80] p-0.5 shadow-[0_0_15px_#00E5FF]">
            <div className="w-full h-full bg-[#05070A] rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider flex items-center gap-1 font-mono">
              HYDRA VOICE ORB <Sparkles className="w-3.5 h-3.5 text-[#4ADE80] animate-spin" />
            </h2>
            <p className="text-[10px] text-gray-400">Natural Language Urban Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => { soundFx.playClickSound(); onClose(); }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 my-4 overflow-y-auto space-y-3 px-1 scrollbar-none">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black font-bold shadow-lg shadow-[#00E5FF]/20'
                : 'glass-panel text-gray-200 border border-white/10 shadow-xl'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Center Animated Glowing AI Waveform Orb */}
      <div className="flex flex-col items-center my-2 space-y-3">
        
        {/* Canvas Waveform Display */}
        <div className="w-full h-20 relative flex items-center justify-center">
          <canvas ref={canvasRef} width={340} height={80} className="w-full h-full" />
        </div>

        {/* Floating Mic Shutter Orb Button */}
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full p-1 transition-all duration-300 transform active:scale-95 shadow-2xl ${
            isListening 
              ? 'bg-gradient-to-tr from-[#FF4D6D] to-[#FFC857] shadow-[0_0_40px_rgba(255,77,109,0.8)] animate-pulse'
              : 'bg-gradient-to-tr from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.7)] hover:scale-105'
          }`}
        >
          <div className="w-full h-full bg-[#05070A] rounded-full border-2 border-white/40 flex items-center justify-center">
            {isListening ? (
              <MicOff className="w-8 h-8 text-[#FF4D6D] animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 text-[#00E5FF]" />
            )}
          </div>
        </button>

        <p className="text-xs font-mono text-gray-400">
          {isListening ? 'LISTENING TO SPEECH INPUT...' : 'TAP ORB TO SPEAK TO HYDRA AI'}
        </p>
      </div>

      {/* Preset Action Quick Chips */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
          SUGGESTED HYDERABAD COMMANDS:
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          {["Report pothole", "Nearby floods", "Weather today", "Nearest hospital"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleQuery(chip)}
              className="py-2 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 font-semibold transition-all active:scale-95 text-left flex items-center justify-between"
            >
              <span>"{chip}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
