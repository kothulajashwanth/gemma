import React, { useState } from 'react';
import { 
  X, Bell, AlertTriangle, CloudRain, FileText, 
  Building2, Check, Trash2, ShieldAlert
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function NotificationDrawer({ onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');

  const categoryIcons = {
    Emergency: ShieldAlert,
    Weather: CloudRain,
    Reports: FileText,
    Government: Building2
  };

  const handleDismiss = (id) => {
    soundFx.playClickSound();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    soundFx.playClickSound();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    return n.type === activeFilter;
  });

  return (
    <div className="absolute inset-0 bg-[#05070A]/95 backdrop-blur-2xl z-50 p-5 overflow-y-auto flex flex-col space-y-4 animate-fadeIn select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#00E5FF]" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wider font-mono">
              HYDRA NOTIFICATION CENTER
            </h2>
            <p className="text-[10px] text-gray-400">HYDERABAD COMMAND DISPATCH FEED</p>
          </div>
        </div>

        <button
          onClick={() => { soundFx.playClickSound(); onClose(); }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Filter Pills & Mark Read */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1.5 overflow-x-auto scrollbar-none py-1">
          {['All', 'Emergency', 'Weather', 'Reports', 'Government'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveFilter(cat); soundFx.playClickSound(); }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border ${
                activeFilter === cat
                  ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-[10px] text-[#00E5FF] font-mono hover:underline flex-shrink-0 ml-2"
        >
          Mark Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 flex-1">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs font-mono">
            NO ACTIVE NOTIFICATIONS IN THIS CATEGORY.
          </div>
        ) : (
          filteredNotifs.map((item) => {
            const IconComp = categoryIcons[item.type] || Bell;
            return (
              <div 
                key={item.id}
                className={`glass-panel p-4 relative overflow-hidden transition-all border ${
                  !item.read ? 'border-[#00E5FF]/40 bg-[#00E5FF]/5' : 'border-white/5 bg-white/5'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-2xl flex-shrink-0 ${
                    item.type === 'Emergency' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                    item.type === 'Weather' ? 'bg-[#FFC857]/20 text-[#FFC857]' : 'bg-[#00E5FF]/20 text-[#00E5FF]'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-400">
                        {item.type} • {item.time}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{item.message}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="p-1 rounded-lg text-gray-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
