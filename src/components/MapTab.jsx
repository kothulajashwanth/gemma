import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, Layers, Navigation, Flame, CloudRain, 
  Car, Filter, ChevronUp, ChevronDown, ArrowUpRight, ThumbsUp, ShieldAlert
} from 'lucide-react';
import L from 'leaflet';
import { MOCK_HAZARDS } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';

export default function MapTab({ hazardList }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHazard, setSelectedHazard] = useState(hazardList[0] || MOCK_HAZARDS[0]);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Layer Toggles
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [trafficActive, setTrafficActive] = useState(true);
  const [weatherRadarActive, setWeatherRadarActive] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Hyderabad Coordinates: 17.4065, 78.4772
      const map = L.map(mapContainerRef.current, {
        center: [17.4239, 78.4071], // Jubilee Hills / Hitec City center
        zoom: 13,
        zoomControl: false
      });

      // Dark Matter CartoDB Basemap Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO & HYDRA OS',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Filter hazards based on selection & search
    const filtered = hazardList.filter(h => {
      const matchCat = selectedCategory === 'All' || h.category === selectedCategory;
      const matchSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    // Render Custom Glowing Cyber Markers
    filtered.forEach(hazard => {
      const isCritical = hazard.severity === 'Critical';
      const color = isCritical ? '#FF4D6D' : '#00E5FF';

      const customIcon = L.divIcon({
        className: 'custom-cyber-marker',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-[#05070a];
            border-radius: 50%;
            background: #05070A;
            border: 2px solid ${color};
            box-shadow: 0 0 15px ${color};
            cursor: pointer;
          ">
            <div style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: ${color};
              margin: auto;
            "></div>
            <div style="
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              border: 1px solid ${color};
              opacity: 0.6;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(hazard.coords, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        soundFx.playClickSound();
        setSelectedHazard(hazard);
        setShowBottomSheet(true);
        map.flyTo(hazard.coords, 15, { duration: 1.2 });
      });

      markersRef.current.push(marker);
    });

  }, [hazardList, selectedCategory, searchQuery]);

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col select-none">
      
      {/* 1. Floating Glass Search Header Bar */}
      <div className="absolute top-4 inset-x-4 z-20 space-y-2">
        <div className="glass-panel p-2 flex items-center space-x-2 border border-white/10 shadow-2xl">
          <Search className="w-4 h-4 text-[#00E5FF] ml-2" />
          <input 
            type="text" 
            placeholder="Search Hyderabad hazards, areas, or depts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none py-1.5"
          />
          <button 
            onClick={() => { soundFx.playClickSound(); setSearchQuery(''); }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs"
          >
            Clear
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-none py-0.5 px-1">
          {['All', 'Pothole', 'Flood Water', 'Garbage', 'Broken Street Light'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); soundFx.playClickSound(); }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-black/60 text-gray-300 border-white/10 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Floating Map Layer Control Buttons (Right Side) */}
      <div className="absolute top-28 right-4 z-20 flex flex-col space-y-2">
        
        {/* Heatmap Layer */}
        <button
          onClick={() => { setHeatmapActive(!heatmapActive); soundFx.playClickSound(); }}
          className={`p-3 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
            heatmapActive 
              ? 'bg-[#FF4D6D]/20 border-[#FF4D6D] text-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.4)]' 
              : 'bg-black/70 border-white/10 text-gray-400 hover:text-white'
          }`}
          title="Toggle Heat Map Overlay"
        >
          <Flame className="w-4 h-4" />
        </button>

        {/* Live Traffic Density */}
        <button
          onClick={() => { setTrafficActive(!trafficActive); soundFx.playClickSound(); }}
          className={`p-3 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
            trafficActive 
              ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
              : 'bg-black/70 border-white/10 text-gray-400 hover:text-white'
          }`}
          title="Toggle Traffic Density Overlay"
        >
          <Car className="w-4 h-4" />
        </button>

        {/* Rain Radar Layer */}
        <button
          onClick={() => { setWeatherRadarActive(!weatherRadarActive); soundFx.playClickSound(); }}
          className={`p-3 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
            weatherRadarActive 
              ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
              : 'bg-black/70 border-white/10 text-gray-400 hover:text-white'
          }`}
          title="Toggle Weather Radar Overlay"
        >
          <CloudRain className="w-4 h-4" />
        </button>

        {/* Recenter Hyderabad */}
        <button
          onClick={() => {
            soundFx.playClickSound();
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([17.4239, 78.4071], 13);
            }
          }}
          className="p-3 rounded-2xl bg-black/70 border border-white/10 text-gray-300 hover:text-white backdrop-blur-md shadow-lg"
          title="Recenter Map"
        >
          <Navigation className="w-4 h-4 text-[#4ADE80]" />
        </button>

      </div>

      {/* 3. Actual Interactive Leaflet Map Div Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10"></div>

      {/* Simulated Layer Banners over Map */}
      {trafficActive && (
        <div className="absolute top-36 left-4 z-20 bg-black/70 backdrop-blur-md border border-[#00E5FF]/30 px-3 py-1 rounded-full text-[10px] font-mono text-[#00E5FF] flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
          <span>LIVE TRAFFIC LAYER ACTIVE</span>
        </div>
      )}

      {/* 4. Draggable Bottom Sheet Issue Card */}
      {selectedHazard && (
        <div 
          className={`absolute bottom-0 inset-x-0 z-30 transition-all duration-300 transform ${
            showBottomSheet ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'
          }`}
        >
          <div className="glass-panel rounded-t-[36px] p-5 border-t border-white/20 bg-[#05070A]/90 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.8)] space-y-3">
            
            {/* Sheet Handle bar */}
            <div 
              onClick={() => { setShowBottomSheet(!showBottomSheet); soundFx.playClickSound(); }}
              className="w-12 h-1.5 rounded-full bg-white/20 mx-auto cursor-pointer hover:bg-white/40 mb-1"
            ></div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  selectedHazard.severity === 'Critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40' : 'bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/40'
                }`}>
                  {selectedHazard.severity} SEVERITY • {selectedHazard.status}
                </span>
                <h3 className="text-base font-extrabold text-white leading-snug">{selectedHazard.title}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {selectedHazard.location}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg">
                <img src={selectedHazard.image} alt={selectedHazard.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Description & Dept */}
            <p className="text-xs text-gray-300 bg-white/5 p-2.5 rounded-2xl border border-white/5 leading-relaxed">
              {selectedHazard.description}
            </p>

            {/* Action Bar: Route to issue */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  soundFx.playSuccessSound();
                  alert(`Navigating to ${selectedHazard.location}... GPS coordinates synced with HYDRA Dispatch.`);
                }}
                className="py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-extrabold text-xs shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center space-x-1.5 hover:brightness-110 active:scale-95 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>ROUTE TO HAZARD</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClickSound();
                  alert(`Upvoted report ${selectedHazard.id}! Sentinel impact points added.`);
                }}
                className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <ThumbsUp className="w-4 h-4 text-[#4ADE80]" />
                <span>UPVOTE ({selectedHazard.upvotes})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
