import React, { useState, useEffect, useRef } from 'react';
import { EyeOff, Camera, Sparkles, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';


interface QuantumLookAwayProps {
  onSuccess: () => void;
}

export const QuantumLookAway: React.FC<QuantumLookAwayProps> = ({ onSuccess }) => {
  // Method: 'camera' | 'sensor'
  const [method, setMethod] = useState<'sensor' | 'camera'>('sensor');

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceDetectedInCenter, setFaceDetectedInCenter] = useState(true);

  // Looking away progress: 0 to 100
  const [progress, setProgress] = useState(0);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sensor countdown state
  const [isSensorRunning, setIsSensorRunning] = useState(false);
  const [sensorSecondsLeft, setSensorSecondsLeft] = useState(3);


  // Refs to avoid stale closures in intervals
  const isLookingAwayRef = useRef(false);
  isLookingAwayRef.current = isLookingAway;
  const isCompletedRef = useRef(false);
  isCompletedRef.current = isCompleted;

  // 1. WEBCAM INITIALIZATION & FRAME ANALYSIS
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setMethod('camera');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Camera access denied or unavailable.';
      setCameraError(`Camera Error: ${errorMsg}. Falling back to Sensor / Idle Mode.`);
      setMethod('sensor');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Analyze video frames to detect if user is looking straight at camera vs looking away
  useEffect(() => {
    if (!isCameraActive || isCompleted) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 80, 60);
      const imgData = ctx.getImageData(0, 0, 80, 60);
      const data = imgData.data;

      // Sample skin-tone/face presence in the center third (x: 26 to 53, y: 15 to 45)
      // vs periphery (x: 0 to 25 and 54 to 80)
      let centerSkinCount = 0;
      let sideSkinCount = 0;

      for (let y = 10; y < 50; y += 2) {
        for (let x = 10; x < 70; x += 2) {
          const idx = (y * 80 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Basic human skin tone heuristic
          const isSkin =
            r > 60 &&
            g > 40 &&
            b > 20 &&
            r > g &&
            r > b &&
            Math.abs(r - g) > 12 &&
            r - b > 12;

          if (isSkin) {
            if (x >= 28 && x <= 52) {
              centerSkinCount++;
            } else {
              sideSkinCount++;
            }
          }
        }
      }

      // If there is significant face/skin directly in the center, user is staring at screen!
      // If center skin count drops significantly or shifts to sides, user looked away!
      const isDirectlyStaring = centerSkinCount > 85 && centerSkinCount >= sideSkinCount * 0.7;

      if (isDirectlyStaring) {
        setFaceDetectedInCenter(true);
        setIsLookingAway(false);
      } else {
        // User turned head left, right, up, down, or moved away!
        setFaceDetectedInCenter(false);
        setIsLookingAway(true);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [isCameraActive, isCompleted]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 2. SENSOR / LOOK-AWAY PROGRESS ACCUMULATOR
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      if (isLookingAwayRef.current) {
        setProgress((prev) => {
          const next = prev + 15;
          if (next >= 100) {
            triggerCompletion();
            return 100;
          }
          return next;
        });
      } else {
        // Looking at screen collapses wave function!
        setProgress((prev) => Math.max(0, prev - 25));
      }
    }, 250);

    return () => clearInterval(timer);
  }, [isCompleted]);

  // 3. TAB VISIBILITY / BLUR DETECTOR (Always Active in Background)
  useEffect(() => {
    if (isCompleted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User tabbed away! Immediately looking away!
        setIsLookingAway(true);
        isLookingAwayRef.current = true;
      } else {
        // User returned
        if (progress >= 100) {
          triggerCompletion();
        } else {
          setIsLookingAway(false);
          isLookingAwayRef.current = false;
        }
      }
    };

    const handleBlur = () => {
      setIsLookingAway(true);
      isLookingAwayRef.current = true;
    };

    const handleFocus = () => {
      if (progress >= 100) {
        triggerCompletion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [progress, isCompleted]);

  // 4. MANUAL SENSOR: "I AM LOOKING AWAY (3s Timer)"
  const startSensorCountdown = () => {
    sounds.playTick();
    setIsSensorRunning(true);
    setSensorSecondsLeft(3);
    setIsLookingAway(true);
    isLookingAwayRef.current = true;


    const interval = setInterval(() => {
      setSensorSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSensorRunning(false);
          setProgress(100);
          triggerCompletion();
          return 0;
        }
        sounds.playTick();
        return prev - 1;
      });
    }, 1000);

    // If mouse moves significantly, cancel sensor
    const handleCancelActivity = () => {
      sounds.playErrorBuzzer();
      clearInterval(interval);
      setIsSensorRunning(false);
      setIsLookingAway(false);
      isLookingAwayRef.current = false;
      setProgress(0);
      window.removeEventListener('mousemove', handleCancelActivity);
    };

    // Allow 600ms grace period before mouse moves cancel
    setTimeout(() => {
      window.addEventListener('mousemove', handleCancelActivity, { once: true });
    }, 600);
  };

  const triggerCompletion = () => {
    if (isCompletedRef.current) return;
    setIsCompleted(true);
    isCompletedRef.current = true;
    stopCamera();
    sounds.playSuccessFanfare();

    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.5 },
    });

    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-5 text-center space-y-4 select-none">
      {isCompleted ? (
        <div className="py-6 space-y-3 animate-bounce">
          <Sparkles className="w-12 h-12 text-[#ffe500] mx-auto fill-yellow-400" />
          <h3 className="text-xl font-black text-emerald-600">
            QUANTUM UN-OBSERVATION CONFIRMED!
          </h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            You successfully looked away from the monitor! The wave function collapsed into a certified session token.
          </p>
          <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Logging you in right now...
          </div>
        </div>
      ) : (
        <>
          {/* Top Instruction Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3 rounded text-xs text-amber-900 text-left space-y-1">
            <p className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Quantum Observer Effect Protocol
            </p>
            <p className="text-[11.5px] leading-relaxed">
              Under Flopkart Quantum Law, this login button <strong>FREEZES AT 0%</strong> whenever you look at the screen. You must look away, turn your head, switch tabs, or trigger the sensor!
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMethod('sensor');
                stopCamera();
              }}
              className={`py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                method === 'sensor'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              Mode A: Look Away Timer / Tab Switch
            </button>
            <button
              type="button"
              onClick={startCamera}
              className={`py-1.5 px-3 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                method === 'camera'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Mode B: AI Webcam Head Tracker</span>
            </button>
          </div>

          {/* Visual Display based on Method */}
          {method === 'camera' ? (
            /* CAMERA MODE: LIVE WEBCAM WITH HEAD-TRACKING HUD */
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-white flex flex-col items-center space-y-2">
              <div className="relative w-64 h-48 bg-black rounded overflow-hidden border-2 border-slate-600 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <canvas ref={canvasRef} width={80} height={60} className="hidden" />

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between text-[10px] font-mono">
                  <div className="flex justify-between items-center">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded text-amber-400">FLOP-CAM v2</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isLookingAway ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'
                    }`}>
                      {isLookingAway ? '✓ LOOKING AWAY' : '⚠️ STARING AT SCREEN'}
                    </span>
                  </div>

                  {/* Crosshair Target Box */}
                  <div className={`self-center w-28 h-28 border-2 rounded transition-all ${
                    faceDetectedInCenter ? 'border-red-500 bg-red-500/10' : 'border-emerald-400 border-dashed bg-emerald-400/10'
                  }`} />

                  <div className="bg-black/70 px-2 py-1 rounded text-center text-[10px]">
                    {faceDetectedInCenter
                      ? '👉 TURN YOUR HEAD TO THE SIDE TO PROCEED'
                      : '✓ HEAD TURNED AWAY! HOLD STILL...'}
                  </div>
                </div>
              </div>

              {cameraError && (
                <p className="text-[11px] text-red-400">{cameraError}</p>
              )}
            </div>
          ) : (
            /* SENSOR / TIMER MODE: ANIMATED UNBLINKING EYE & BUTTON */
            <div className="py-3 flex flex-col items-center justify-center space-y-3">
              {/* Unblinking Eyeball Widget */}
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLookingAway ? 'bg-emerald-100 ring-4 ring-emerald-400 scale-105' : 'bg-red-100 ring-4 ring-red-400 animate-pulse'
              }`}>
                <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow">
                  <path
                    d="M10,50 Q50,15 90,50 Q50,85 10,50 Z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={isLookingAway ? 10 : 18}
                    fill={isLookingAway ? '#10b981' : '#dc2626'}
                    className="transition-all duration-200"
                  />
                  <circle cx="50" cy="50" r="7" fill="#09090b" />
                  <circle cx="47" cy="47" r="2.5" fill="#ffffff" />
                </svg>

                <span className={`absolute -bottom-2 text-[10px] font-black px-2 py-0.5 rounded shadow ${
                  isLookingAway ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {isLookingAway ? 'UNOBSERVED' : 'WATCHING YOU'}
                </span>
              </div>

              <div className="text-center max-w-xs">
                <p className={`text-sm font-black ${isLookingAway ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isLookingAway ? '🙈 UNOBSERVED! Quantum Progress Climbing!' : '👀 EYE CONTACT DETECTED! Progress Frozen.'}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Click the button below, then physically look away from your monitor for 3 seconds without moving your mouse.
                </p>
              </div>

              {/* Countdown Action Button */}
              <button
                type="button"
                onClick={startSensorCountdown}
                disabled={isSensorRunning}
                className={`py-2.5 px-6 rounded-lg font-black text-xs shadow-md transition-transform flex items-center justify-center gap-2 cursor-pointer ${
                  isSensorRunning
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-[#2874f0] hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                {isSensorRunning ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>KEEP LOOKING AWAY! ({sensorSecondsLeft}s remaining)</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>I AM LOOKING AWAY (START 3-SEC TIMER)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Real-time Quantum Progress Bar */}
          <div className="space-y-1 pt-1 text-left">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1">
                <span>Quantum Tunneling Progress:</span>
                {isLookingAway && <span className="text-emerald-600 animate-pulse">(TUNNELING)</span>}
              </span>
              <span className="font-mono text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-200 ${
                  progress >= 100
                    ? 'bg-emerald-500'
                    : isLookingAway
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center italic">
              *Pro-tip: You can also just switch to another browser tab or minimize window, and you will be logged in when you return!
            </p>
          </div>
        </>
      )}
    </div>
  );
};
