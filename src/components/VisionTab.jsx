import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Zap, Upload, RefreshCw, CheckCircle2, AlertOctagon, 
  Sparkles, Layers, ShieldCheck, ArrowRight, Video, VideoOff, Info, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_VISION_SAMPLES } from '../utils/mockData';
import { soundFx } from '../utils/audioSynth';
import { queryGeminiVision } from '../utils/geminiAi';

export default function VisionTab({ onCreateReport }) {
  const [selectedSample, setSelectedSample] = useState(MOCK_VISION_SAMPLES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanAnalysis, setScanAnalysis] = useState(MOCK_VISION_SAMPLES[0]);
  const videoRef = useRef(null);

  // Toggle Live Webcam
  const toggleWebcam = async () => {
    soundFx.playClickSound();
    if (useWebcam) {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
      setWebcamStream(null);
      setUseWebcam(false);
      setCapturedImage(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setWebcamStream(stream);
        setUseWebcam(true);
        setCapturedImage(null);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Camera access unavailable or blocked. Using HYDRA AI synthetic camera feed.");
      }
    }
  };

  useEffect(() => {
    if (useWebcam && videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam, webcamStream]);

  // Capture Image & Trigger Vision AI Analysis
  const handleTriggerScan = async (sampleObj = null) => {
    soundFx.playScanSound();
    setIsScanning(true);

    let imageBase64 = "";

    // If using live webcam, capture frame from video stream
    if (useWebcam && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        imageBase64 = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageBase64);
      } catch (err) {
        console.warn("Could not capture frame from video:", err);
      }
    }

    try {
      if (sampleObj) {
        // Preset sample test path
        setTimeout(() => {
          setScanAnalysis(sampleObj);
          setIsScanning(false);
          soundFx.playSuccessSound();
        }, 1200);
      } else if (imageBase64) {
        // Real-time camera Vision AI Analysis
        const result = await queryGeminiVision(imageBase64);
        if (result) {
          setScanAnalysis({
            id: `HZ-${Math.floor(1000 + Math.random() * 9000)}`,
            hazardType: result.hazardType,
            title: result.label || `${result.hazardType} Anomaly`,
            severity: result.severity,
            confidence: result.confidence || 95.0,
            recommendation: result.recommendation,
            dept: result.dept,
            image: imageBase64,
            boxes: [
              { label: result.label, confidence: result.confidence, x: 25, y: 30, width: 50, height: 45, color: result.severity === 'Critical' ? '#FF4D6D' : '#00E5FF' }
            ]
          });
        }
        setIsScanning(false);
        soundFx.playSuccessSound();
      } else {
        // Fallback standard presets
        setTimeout(() => {
          setScanAnalysis(selectedSample);
          setIsScanning(false);
          soundFx.playSuccessSound();
        }, 1200);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setIsScanning(false);
    }
  };

  // Submit Civic Report Action
  const handleCreateCivicReport = () => {
    soundFx.playSuccessSound();
    
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 }
    });

    const newReport = {
      id: `HZ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${scanAnalysis.title || scanAnalysis.hazardType} Detected via AI Vision`,
      category: scanAnalysis.hazardType,
      location: "Live Camera Coordinate Sector, Hyderabad",
      coords: [17.4325, 78.4071],
      severity: scanAnalysis.severity,
      confidence: scanAnalysis.confidence,
      status: "Submitted",
      dept: scanAnalysis.dept,
      date: new Date().toLocaleString(),
      upvotes: 1,
      image: scanAnalysis.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      description: scanAnalysis.recommendation
    };

    onCreateReport(newReport);
    alert(`Live Anomaly Report ${newReport.id} successfully registered with ${scanAnalysis.dept}!`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8 select-none">
      
      {/* Vision Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            HYDRA Vision AI <Sparkles className="w-5 h-5 text-[#00E5FF] animate-spin" />
          </h2>
          <p className="text-xs text-gray-400 font-mono">Realtime Live Hyderabad Object & Anomaly Lens</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Flash Toggle */}
          <button
            onClick={() => { setFlashOn(!flashOn); soundFx.playClickSound(); }}
            className={`p-2.5 rounded-xl border transition-all ${
              flashOn 
                ? 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFC857] shadow-[0_0_15px_rgba(255,200,87,0.4)]' 
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
            title="Camera Flash"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Webcam / Simulator Switch */}
          <button
            onClick={toggleWebcam}
            className={`p-2.5 rounded-xl border transition-all ${
              useWebcam 
                ? 'bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.2)]' 
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
            title="Toggle Live WebCam Feed"
          >
            {useWebcam ? <Video className="w-4 h-4 text-[#4ADE80]" /> : <VideoOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Viewfinder Panel */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.2)] bg-black aspect-[4/3] flex items-center justify-center group">
        
        {/* Flash Effect Overlay */}
        {flashOn && <div className="absolute inset-0 bg-white/20 pointer-events-none z-30"></div>}

        {/* Video stream or Captured Frame */}
        {useWebcam ? (
          capturedImage ? (
            <img src={capturedImage} alt="Captured frame" className="w-full h-full object-cover" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
          )
        ) : (
          <img 
            src={capturedImage || selectedSample.image} 
            alt="AI Camera View" 
            className="w-full h-full object-cover" 
          />
        )}

        {/* Bounding Box Overlays */}
        {!isScanning && scanAnalysis?.boxes && scanAnalysis.boxes.map((box, i) => (
          <div 
            key={i}
            className="absolute border-2 rounded-xl backdrop-blur-[1px] animate-pulse pointer-events-none z-20"
            style={{
              left: `${box.x || 25}%`,
              top: `${box.y || 30}%`,
              width: `${box.width || 50}%`,
              height: `${box.height || 40}%`,
              borderColor: scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF',
              boxShadow: `0 0 20px ${scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF'}60`
            }}
          >
            <div 
              className="absolute -top-7 left-0 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-black flex items-center gap-1 shadow-md whitespace-nowrap"
              style={{ backgroundColor: scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF' }}
            >
              <span>{scanAnalysis.title || scanAnalysis.hazardType}</span>
              <span>[{scanAnalysis.confidence}%]</span>
            </div>
          </div>
        ))}

        {/* Scanning Sweep */}
        {isScanning && (
          <div className="absolute inset-0 bg-[#00E5FF]/10 z-30 flex flex-col items-center justify-center">
            <div className="w-full h-1.5 bg-[#00E5FF] shadow-[0_0_25px_#00E5FF] animate-scan"></div>
            <div className="bg-black/80 px-4 py-2 rounded-full border border-[#00E5FF]/50 text-[#00E5FF] font-mono text-xs font-bold flex items-center space-x-2 shadow-2xl backdrop-blur-md">
              <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF]" />
              <span>LIVE AI NEURAL ANALYSIS...</span>
            </div>
          </div>
        )}

        {/* Corner HUD targets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00E5FF]"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00E5FF]"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00E5FF]"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00E5FF]"></div>

        <div className="absolute top-3 inset-x-0 flex justify-center space-x-2 px-4 z-20">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-400">
            {useWebcam ? "LIVE SATELLITE RADAR CONNECTED" : "SYNTHETIC SIMULATOR NODE"}
          </span>
        </div>

        {/* Shutter controls */}
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-between px-6 z-20">
          <label className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white cursor-pointer transition-all">
            <Upload className="w-5 h-5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setCapturedImage(url);
                  handleTriggerScan();
                }
              }}
            />
          </label>

          {/* Shutter Capture Button */}
          <button
            onClick={() => handleTriggerScan()}
            disabled={isScanning}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00E5FF] via-white to-[#4ADE80] p-1 shadow-[0_0_30px_rgba(0,229,255,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#05070A] rounded-full border-2 border-white/40 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#00E5FF] animate-pulse"></div>
            </div>
          </button>

          {/* Rescan / Reset */}
          <button
            onClick={() => { setCapturedImage(null); handleTriggerScan(); }}
            className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all"
            title="Re-scan Feed"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
          SIMULATOR HAZARD PRESETS:
        </label>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {MOCK_VISION_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setSelectedSample(sample);
                setCapturedImage(null);
                handleTriggerScan(sample);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                selectedSample.id === sample.id
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly Analysis Card Result */}
      <div className="glass-card-cyan p-5 relative space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> LIVE SPATIAL RADAR DETAILS
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">{scanAnalysis.title || scanAnalysis.hazardType}</h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-mono">MATCH CONFIDENCE</span>
            <p className="text-xl font-extrabold text-[#4ADE80] font-mono">{scanAnalysis.confidence}%</p>
          </div>
        </div>

        {/* Severity & Department Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <p className="text-[10px] font-mono text-gray-400 uppercase">SEVERITY INDEX</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`w-3 h-3 rounded-full ${
                scanAnalysis.severity === 'Critical' ? 'bg-[#FF4D6D] animate-ping' : 'bg-[#FFC857]'
              }`}></span>
              <span className={`text-sm font-bold ${
                scanAnalysis.severity === 'Critical' ? 'text-[#FF4D6D]' : 'text-[#FFC857]'
              }`}>
                {scanAnalysis.severity}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <p className="text-[10px] font-mono text-gray-400 uppercase">TARGET DEPARTMENT</p>
            <p className="text-xs font-bold text-white mt-1 truncate">{scanAnalysis.dept}</p>
          </div>
        </div>

        {/* Live recommendations / bus arrival info */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
          <p className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> {scanAnalysis.hazardType === 'Bus Stand' ? 'UPCOMING DEPARTURES & ARRIVALS:' : 'AI MITIGATION ACTION RECOMMENDATION:'}
          </p>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{scanAnalysis.recommendation}</p>
        </div>

        {/* Action Button: Create Civic Report */}
        <button
          onClick={handleCreateCivicReport}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] text-black font-extrabold text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
        >
          <span>{scanAnalysis.hazardType === 'Bus Stand' ? 'SYNC RTC TRANSIT SCHEDULE' : 'DISPATCH OFFICIAL CIVIC REPORT'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}
