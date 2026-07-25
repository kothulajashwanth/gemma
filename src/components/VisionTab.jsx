import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, Upload, RefreshCw, CheckCircle2, AlertOctagon, 
  Sparkles, ShieldCheck, ArrowRight, Video, VideoOff, Info, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audioSynth';
import { queryGeminiVision } from '../utils/geminiAi';

export default function VisionTab({ onCreateReport }) {
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanAnalysis, setScanAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);

  // Initialize webcam feed automatically on mount
  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        activeStream = stream;
        setWebcamStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setErrorMessage("Webcam permissions not granted or camera busy. Click upload or check permissions.");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Photo Capture / Frame Scan
  const handleTriggerScan = async () => {
    soundFx.playScanSound();
    setIsScanning(true);
    setErrorMessage('');
    setScanAnalysis(null);

    let imageBase64 = "";

    // 1. Capture current frame from live HTML5 Video stream
    if (videoRef.current && webcamStream && !capturedImage) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        imageBase64 = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageBase64);
      } catch (err) {
        console.error("Frame capture error:", err);
      }
    } else if (capturedImage) {
      imageBase64 = capturedImage;
    }

    if (!imageBase64) {
      setErrorMessage("No active camera frame found to analyze. Please upload or start camera.");
      setIsScanning(false);
      return;
    }

    try {
      // 2. Call Google Gemini Multimodal Vision API directly with frame data
      const result = await queryGeminiVision(imageBase64);
      
      if (result) {
        if (result.hazardType === 'None' || result.hazardType === 'none') {
          setScanAnalysis({
            hazardType: "None",
            title: "Clear Environment",
            severity: "Low",
            confidence: result.confidence || 99,
            recommendation: "No anomalies, hazards, or public structures identified in this sector. Area is clean and safe.",
            dept: "None",
            image: imageBase64,
            boxes: []
          });
        } else {
          setScanAnalysis({
            hazardType: result.hazardType,
            title: result.label || result.hazardType,
            severity: result.severity || "Medium",
            confidence: result.confidence || 95.0,
            recommendation: result.recommendation,
            dept: result.dept || "GHMC Command Center",
            image: imageBase64,
            boxes: [
              { 
                label: result.label, 
                confidence: result.confidence, 
                x: 20, 
                y: 25, 
                width: 60, 
                height: 50, 
                color: result.severity === 'Critical' ? '#FF4D6D' : '#00E5FF' 
              }
            ]
          });
        }
        soundFx.playSuccessSound();
      } else {
        setErrorMessage("Vision AI Engine Offline. Verify Google Gemini API Key configuration.");
      }
    } catch (err) {
      setErrorMessage("AI analysis failed or timed out. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // Submit Civic Report Action
  const handleCreateCivicReport = () => {
    if (!scanAnalysis || scanAnalysis.hazardType === 'None') return;

    soundFx.playSuccessSound();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 }
    });

    const newReport = {
      id: `HZ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${scanAnalysis.title} Detected via AI Vision`,
      category: scanAnalysis.hazardType,
      location: "Captured Sector, Cyberabad, Hyderabad",
      coords: [17.4325, 78.4071],
      severity: scanAnalysis.severity,
      confidence: scanAnalysis.confidence,
      status: "Submitted",
      dept: scanAnalysis.dept,
      date: new Date().toLocaleString(),
      upvotes: 1,
      image: scanAnalysis.image,
      description: scanAnalysis.recommendation
    };

    onCreateReport(newReport);
    alert(`Live Report ${newReport.id} successfully registered with ${scanAnalysis.dept}!`);
  };

  // Reset Camera Viewfinder
  const resetCamera = () => {
    soundFx.playClickSound();
    setCapturedImage(null);
    setScanAnalysis(null);
    setErrorMessage('');
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
        </div>
      </div>

      {/* Viewfinder Panel */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.2)] bg-black aspect-[4/3] flex items-center justify-center">
        
        {/* Flash Effect Overlay */}
        {flashOn && <div className="absolute inset-0 bg-white/20 pointer-events-none z-30"></div>}

        {/* Video feed or Captured Frame */}
        {capturedImage ? (
          <img src={capturedImage} alt="Captured frame" className="w-full h-full object-cover" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover" 
          />
        )}

        {/* Bounding Box Overlays */}
        {!isScanning && scanAnalysis?.boxes && scanAnalysis.boxes.map((box, i) => (
          <div 
            key={i}
            className="absolute border-2 rounded-xl backdrop-blur-[1px] animate-pulse pointer-events-none z-20"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              borderColor: scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF',
              boxShadow: `0 0 20px ${scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF'}60`
            }}
          >
            <div 
              className="absolute -top-7 left-0 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-black flex items-center gap-1 shadow-md whitespace-nowrap"
              style={{ backgroundColor: scanAnalysis.severity === 'Critical' ? '#FF4D6D' : '#00E5FF' }}
            >
              <span>{scanAnalysis.title}</span>
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
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE HYDERABAD NEURAL CAMERA FEED
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
                  setScanAnalysis(null);
                  setErrorMessage('');
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
            onClick={resetCamera}
            className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all"
            title="Reset Camera View"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error / Status Alert Banner */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-[#FF4D6D]/15 border border-[#FF4D6D]/40 text-xs text-[#FF4D6D] flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Anomaly Analysis Card Result */}
      {scanAnalysis && (
        <div className="glass-card-cyan p-5 relative space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> LIVE CAMERA TELEMETRY DETAILS
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">{scanAnalysis.title}</h3>
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
          {scanAnalysis.hazardType !== 'None' && (
            <button
              onClick={handleCreateCivicReport}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#4ADE80] to-[#00E5FF] text-black font-extrabold text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>{scanAnalysis.hazardType === 'Bus Stand' ? 'SYNC RTC TRANSIT SCHEDULE' : 'DISPATCH OFFICIAL CIVIC REPORT'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
