import React, { useState } from 'react';
import MobileContainer from './components/MobileContainer';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import VisionTab from './components/VisionTab';
import MapTab from './components/MapTab';
import ReportsTab from './components/ReportsTab';
import ProfileTab from './components/ProfileTab';
import WeatherModal from './components/WeatherModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import NotificationDrawer from './components/NotificationDrawer';
import { MOCK_HAZARDS } from './utils/mockData';
import { soundFx } from './utils/audioSynth';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'vision' | 'maps' | 'reports' | 'profile'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [showWeather, setShowWeather] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Live Civic Reports State
  const [reportsList, setReportsList] = useState(MOCK_HAZARDS);

  const handleCreateReport = (newReport) => {
    setReportsList(prev => [newReport, ...prev]);
    setActiveTab('reports');
  };

  const handleUpvoteReport = (reportId) => {
    setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  return (
    <MobileContainer soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}>
      {/* 1. Cyber Boot Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {!showSplash && (
        <div className="w-full h-full flex flex-col relative bg-[#05070A] overflow-hidden select-none">
          
          {/* Top Header Status Bar */}
          <Header 
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenWeather={() => setShowWeather(true)}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            unreadCount={2}
          />

          {/* Active Screen View */}
          <main className="flex-1 overflow-hidden flex flex-col relative">
            {activeTab === 'home' && (
              <HomeTab 
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenWeather={() => setShowWeather(true)}
                onOpenEmergency={() => setShowEmergencyModal(true)}
              />
            )}

            {activeTab === 'vision' && (
              <VisionTab onCreateReport={handleCreateReport} />
            )}

            {activeTab === 'maps' && (
              <MapTab hazardList={reportsList} />
            )}

            {activeTab === 'reports' && (
              <ReportsTab reports={reportsList} onUpvoteReport={handleUpvoteReport} />
            )}

            {activeTab === 'profile' && (
              <ProfileTab 
                soundEnabled={soundEnabled} 
                setSoundEnabled={setSoundEnabled}
                onLogout={() => setShowSplash(true)}
              />
            )}
          </main>

          {/* 5-Tab Bottom Navigation with Floating AI Orb */}
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onOpenVoiceAssistant={() => setShowVoiceAssistant(true)}
          />

          {/* Overlays & Modals */}
          {showWeather && (
            <WeatherModal onClose={() => setShowWeather(false)} />
          )}

          {showVoiceAssistant && (
            <VoiceAssistantModal 
              onClose={() => setShowVoiceAssistant(false)} 
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {showNotifications && (
            <NotificationDrawer onClose={() => setShowNotifications(false)} />
          )}

          {/* Emergency SOS Warning Modal */}
          {showEmergencyModal && (
            <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-6 flex flex-col justify-center items-center text-center space-y-5 animate-fadeIn">
              <div className="w-24 h-24 rounded-full bg-[#FF4D6D]/20 border-2 border-[#FF4D6D] flex items-center justify-center shadow-[0_0_50px_rgba(255,77,109,0.8)] animate-bounce">
                <ShieldAlert className="w-12 h-12 text-[#FF4D6D]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-[#FF4D6D] tracking-wider uppercase font-mono">
                  HYDRA EMERGENCY DISPATCH
                </h2>
                <p className="text-xs text-gray-300">
                  Connecting to Hyderabad Rapid Response Command (Dial 112 / 100)
                </p>
              </div>

              <div className="w-full glass-panel p-4 text-xs text-left space-y-2 border border-[#FF4D6D]/40">
                <p className="text-[10px] font-mono text-[#FF4D6D] uppercase font-bold">AUTOMATIC GPS TELEMETRY:</p>
                <p className="text-gray-300 font-mono">LOCATION: 17.4325° N, 78.4071° E (Hyderabad Sector 4)</p>
                <p className="text-gray-300 font-mono">SENTINEL ID: HYD-9042-JASHWANTH</p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    soundFx.playSuccessSound();
                    alert("Emergency Hotline Dialed! HYDRA Disaster & Police teams alerted.");
                    setShowEmergencyModal(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#C77DFF] text-white font-extrabold text-sm shadow-[0_0_30px_rgba(255,77,109,0.5)] flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                  <span>CALL DISPATCH 112 NOW</span>
                </button>

                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full py-3 rounded-2xl bg-white/5 text-gray-400 font-medium text-xs hover:text-white"
                >
                  CANCEL ALARM
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </MobileContainer>
  );
}
