import React from 'react';
import { 
  X, CloudRain, Sun, Wind, Droplets, Flame, AlertTriangle, 
  ChevronRight, Thermometer, ShieldCheck
} from 'lucide-react';
import { HYDERABAD_AQI } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function WeatherModal({ onClose }) {
  const hourlyForecast = [
    { time: 'NOW', temp: 31, rain: 20 },
    { time: '1 PM', temp: 33, rain: 45 },
    { time: '2 PM', temp: 34, rain: 80 },
    { time: '3 PM', temp: 30, rain: 90 },
    { time: '4 PM', temp: 28, rain: 65 },
    { time: '5 PM', temp: 27, rain: 30 }
  ];

  const weeklyForecast = [
    { day: 'TODAY', temp: '34° / 24°', icon: CloudRain, label: 'Heavy Convection' },
    { day: 'SUN', temp: '33° / 23°', icon: CloudRain, label: 'Thunderstorms' },
    { day: 'MON', temp: '31° / 22°', icon: Sun, label: 'Partly Sunny' },
    { day: 'TUE', temp: '32° / 23°', icon: Sun, label: 'Clear Sky' },
    { day: 'WED', temp: '35° / 25°', icon: Flame, label: 'High Heat' }
  ];

  return (
    <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-5 overflow-y-auto flex flex-col space-y-4 animate-fadeIn select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Hyderabad Climate Radar <CloudRain className="w-5 h-5 text-[#00E5FF]" />
          </h2>
          <p className="text-xs text-gray-400 font-mono">Realtime Satellite & Micro-Climate Sensor Mesh</p>
        </div>

        <button
          onClick={() => { soundFx.playClickSound(); onClose(); }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Temperature & AQI Gauge */}
      <div className="glass-card-cyan p-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00E5FF]/20 rounded-full blur-3xl"></div>
        
        <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
          CYBERABAD SECTOR METEOROLOGY
        </span>

        <h1 className="text-6xl font-extrabold text-white mt-4 font-sans tracking-tight">
          {HYDERABAD_AQI.temp}°<span className="text-3xl text-[#00E5FF]">C</span>
        </h1>
        <p className="text-sm font-semibold text-gray-300 mt-1">Convective Rain Clouds Approaching</p>

        {/* Severe Alert Pill */}
        <div className="mt-4 p-3 rounded-2xl bg-[#FFC857]/15 border border-[#FFC857]/40 flex items-center space-x-3 text-xs text-[#FFC857] text-left">
          <Flame className="w-5 h-5 flex-shrink-0 animate-pulse text-[#FFC857]" />
          <div>
            <p className="font-bold">HEAT & FLOOD ADVISORY</p>
            <p className="text-[11px] opacity-90">{HYDERABAD_AQI.heatWarning}</p>
          </div>
        </div>
      </div>

      {/* Weather Parameters Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-3.5">
          <span className="text-[10px] font-mono text-gray-400 uppercase">AIR QUALITY INDEX</span>
          <p className="text-2xl font-extrabold text-[#4ADE80] font-mono mt-1">{HYDERABAD_AQI.score}</p>
          <p className="text-[10px] text-gray-300 mt-0.5">{HYDERABAD_AQI.status} (PM2.5: {HYDERABAD_AQI.pm25})</p>
        </div>

        <div className="glass-panel p-3.5">
          <span className="text-[10px] font-mono text-gray-400 uppercase">WIND SPEED</span>
          <p className="text-2xl font-extrabold text-[#00E5FF] font-mono mt-1">{HYDERABAD_AQI.windSpeed} <span className="text-xs">km/h</span></p>
          <p className="text-[10px] text-gray-300 mt-0.5">South-West Monsoon Gusts</p>
        </div>

        <div className="glass-panel p-3.5">
          <span className="text-[10px] font-mono text-gray-400 uppercase">HUMIDITY</span>
          <p className="text-2xl font-extrabold text-blue-400 font-mono mt-1">{HYDERABAD_AQI.humidity}%</p>
          <p className="text-[10px] text-gray-300 mt-0.5">High Moisture Ingress</p>
        </div>

        <div className="glass-panel p-3.5">
          <span className="text-[10px] font-mono text-gray-400 uppercase">UV RADIATION</span>
          <p className="text-2xl font-extrabold text-[#FFC857] font-mono mt-1">{HYDERABAD_AQI.uvIndex} <span className="text-xs">/ 12</span></p>
          <p className="text-[10px] text-gray-300 mt-0.5">High Index Peak</p>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="glass-panel p-4 space-y-2">
        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">HOURLY RAIN & TEMP</h3>
        
        <div className="flex space-x-3 overflow-x-auto scrollbar-none py-2">
          {hourlyForecast.map((h, i) => (
            <div key={i} className="flex-1 min-w-[64px] bg-white/5 p-2.5 rounded-2xl text-center border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 font-mono">{h.time}</span>
              <p className="text-sm font-extrabold text-white">{h.temp}°</p>
              <div className="text-[9px] text-[#00E5FF] font-mono font-bold flex items-center justify-center gap-0.5">
                <CloudRain className="w-3 h-3" /> {h.rain}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="glass-panel p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">7-DAY HYDERABAD OUTLOOK</h3>

        <div className="space-y-2">
          {weeklyForecast.map((w, i) => {
            const Icon = w.icon;
            return (
              <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-[#00E5FF]" />
                  <div>
                    <p className="font-bold text-white">{w.day}</p>
                    <p className="text-[10px] text-gray-400">{w.label}</p>
                  </div>
                </div>
                <span className="font-mono text-gray-200 font-bold">{w.temp}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
