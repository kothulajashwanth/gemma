import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, Upload, RefreshCw, AlertOctagon, 
  Sparkles, ShieldCheck, ArrowRight, Video, VideoOff, Info, Loader2, Eye
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
  const [autoScanActive, setAutoScanActive] = useState(true);

  const videoRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Reset entire detection state cleanly before any new scan
  const resetDetectionState = () => {
    console.log("[AI Vision] Resetting detection state & cancelling pending requests...");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setScanAnalysis(null);
    setErrorMessage('');
  };

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
        setErrorMessage("Webcam permissions not granted. Click upload icon below to analyze a photo.");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Continuous Auto-Scan Loop
  useEffect(() => {
    if (webcamStream && autoScanActive && !scanAnalysis && !isScanning) {
      scanIntervalRef.current = setInterval(() => {
        autoCaptureAndScan();
      }, 6000);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [webcamStream, autoScanActive, scanAnalysis, isScanning]);

  // Client-side Image Compressor Helper
  const compressImage = (dataUrl, maxWidth = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  // Autonomous Frame Capture & Gemini Vision Analysis
  const autoCaptureAndScan = async () => {
    if (!videoRef.current || isScanning || scanAnalysis) return;

    resetDetectionState();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const rawBase64 = canvas.toDataURL('image/jpeg');
      const compressedBase64 = await compressImage(rawBase64);
      
      setIsScanning(true);
      abortControllerRef.current = new AbortController();

      console.log(`[AI Vision] Auto-capture frame created. Payload length: ${compressedBase64.length}`);

      const result = await queryGeminiVision(compressedBase64, abortControllerRef.current.signal);
      
      if (result && result.hazards && result.hazards.length > 0) {
        soundFx.playAlertSound();
        setScanAnalysis({
          timestamp: Date.now(),
          description: result.description,
          summary: result.summary,
          overallRisk: result.overallRisk || "Medium",
          hazards: result.hazards,
          image: compressedBase64
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn("[AI Vision] Auto-scan tick error:", err.message);
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Manual Trigger shutter action
  const handleTriggerScan = async (fileBase64 = null) => {
    soundFx.playScanSound();
    resetDetectionState();
    setIsScanning(true);

    let imageBase64 = fileBase64;

    if (!imageBase64 && videoRef.current && webcamStream) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const rawBase64 = canvas.toDataURL('image/jpeg');
        imageBase64 = await compressImage(rawBase64);
        setCapturedImage(imageBase64);
      } catch (err) {
        console.error("Frame capture error:", err);
      }
    }

    if (!imageBase64) {
      setErrorMessage("No active camera frame or uploaded photo found. Please try again.");
      setIsScanning(false);
      return;
    }

    console.log(`[AI Vision] Manual scan initiated. Payload length: ${imageBase64.length}`);
    abortControllerRef.current = new AbortController();

    try {
      const result = await queryGeminiVision(imageBase64, abortControllerRef.current.signal);
      
      if (result) {
        setScanAnalysis({
          timestamp: Date.now(),
          description: result.description,
          summary: result.summary,
          overallRisk: result.overallRisk || "Low",
          hazards: result.hazards || [],
          image: imageBase64
        });
        soundFx.playSuccessSound();
      } else {
        setErrorMessage("Unable to analyze this image. Please retry.");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setErrorMessage("Unable to analyze this image. Please retry.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Dispatch individual civic report to GHMC
  const handleCreateCivicReport = (hazard) => {
    soundFx.playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    const newReport = {
      id: `HZ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${hazard.label || hazard.type} Detected`,
      category: hazard.type,
      location: "Live Camera Coordinate Sector, Hyderabad",
      coords: [17.4325, 78.4071],
      severity: hazard.severity,
      confidence: hazard.confidence,
      status: "Submitted",
      dept: hazard.department,
      date: new Date().toLocaleString(),
      upvotes: 1,
      image: scanAnalysis.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      description: hazard.recommendation
    };

    onCreateReport(newReport);
    alert(`Live Report ${newReport.id} successfully registered with ${hazard.department}!`);
  };

  const resetCamera = () => {
    soundFx.playClickSound();
    setCapturedImage(null);
    resetDetectionState();
    setAutoScanActive(true);
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
          <span className="px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono flex items-center gap-1.5 animate-pulse">
            <Eye className="w-3.5 h-3.5" />
            <span>AUTO-SCANNING ACTIVE</span>
          </span>

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

        {/* Dynamic Multi-Object Bounding Box Overlays (Drawn ONLY when coordinates exist) */}
        {!isScanning && scanAnalysis?.hazards && scanAnalysis.hazards.map((hazard, i) => {
          if (!hazard.box || !Array.isArray(hazard.box) || hazard.box.length < 4) return null;
          
          const box = hazard.box;
          const isCritical = hazard.severity === 'Critical' || hazard.severity === 'High';
          const color = isCritical ? '#FF4D6D' : '#00E5FF';

          return (
            <div 
              key={`${scanAnalysis.timestamp}-${i}`}
              className="absolute border-2 rounded-xl backdrop-blur-[1px] animate-pulse pointer-events-none z-20 transition-all duration-300"
              style={{
                top: `${box[0]}%`,
                left: `${box[1]}%`,
                width: `${box[2]}%`,
                height: `${box[3]}%`,
                borderColor: color,
                boxShadow: `0 0 20px ${color}60`
              }}
            >
              <div 
                className="absolute -top-7 left-0 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-black shadow-md whitespace-nowrap"
                style={{ backgroundColor: color }}
              >
                ⚠ {hazard.label} [{hazard.confidence}%]
              </div>
            </div>
          );
        })}

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
          <label className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white cursor-pointer transition-all active:scale-95">
            <Upload className="w-5 h-5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    resetDetectionState();
                    const compressed = await compressImage(reader.result);
                    setCapturedImage(compressed);
                    setAutoScanActive(false);
                    handleTriggerScan(compressed);
                  };
                  reader.readAsDataURL(file);
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
            className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all active:scale-95"
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

      {/* Multi-Hazard Result Timeline & Banners (Rendered ONLY from current scan timestamp) */}
      {scanAnalysis && (
        <div key={scanAnalysis.timestamp} className="space-y-3 animate-fadeIn">
          
          <div className="glass-panel p-4 border border-white/10">
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" /> HYDRA VISION OVERALL ANALYSIS
            </span>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">{scanAnalysis.description}</p>
            
            {scanAnalysis.hazards.length === 0 ? (
              <p className="text-sm font-bold text-[#4ADE80] mt-3 flex items-center gap-2">
                ✓ No significant disaster or civic hazard detected. Sector status normal.
              </p>
            ) : (
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">SECTOR OVERALL RISK:</span>
                <span className={`font-mono font-bold ${
                  scanAnalysis.overallRisk === 'Critical' || scanAnalysis.overallRisk === 'High' ? 'text-[#FF4D6D]' : 'text-[#FFC857]'
                }`}>
                  {scanAnalysis.overallRisk || 'Medium'}
                </span>
              </div>
            )}
          </div>

          {/* Individual Hazard Cards for THIS scan only */}
          {scanAnalysis.hazards.map((hazard, index) => {
            const isCritical = hazard.severity === 'Critical' || hazard.severity === 'High';
            return (
              <div 
                key={`${scanAnalysis.timestamp}-card-${index}`}
                className={`p-5 rounded-[28px] border transition-all duration-300 ${
                  isCritical 
                    ? 'bg-gradient-to-br from-[#FF4D6D]/10 to-transparent border-[#FF4D6D]/40 shadow-lg shadow-[#FF4D6D]/10' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                      isCritical ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' : 'bg-[#FFC857]/20 text-[#FFC857]'
                    }`}>
                      ⚠ {hazard.severity} Severity
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1.5">{hazard.label || hazard.type}</h3>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">Routed to: {hazard.department}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-mono">CONFIDENCE</span>
                    <p className={`text-lg font-extrabold font-mono ${isCritical ? 'text-[#FF4D6D]' : 'text-[#4ADE80]'}`}>
                      {hazard.confidence}%
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
                  <p className="text-[9px] font-mono text-[#00E5FF] uppercase font-bold">RECOMMENDATION / TIMINGS:</p>
                  <p className="text-gray-300 mt-1 leading-relaxed whitespace-pre-line">{hazard.recommendation}</p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleCreateCivicReport(hazard)}
                  className={`w-full mt-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                    isCritical
                      ? 'bg-gradient-to-r from-[#FF4D6D] to-[#C77DFF] text-white shadow-md'
                      : 'bg-gradient-to-r from-[#00E5FF] to-[#4ADE80] text-black font-extrabold shadow-md'
                  }`}
                >
                  <span>{hazard.type === 'Bus Stand' ? 'SYNC RTC TRANSIT SCHEDULE' : 'REPORT TO DEPARTMENT'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
