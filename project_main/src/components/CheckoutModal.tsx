import React, { useState, useRef, useEffect } from 'react';
import { X, Lock, Check, Banknote, PenTool, Handshake } from 'lucide-react';
import { sounds } from '../utils/audio';


interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  surchargeAmount: number;
  onCompletePayment: (paymentMethod: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  surchargeAmount,
  onCompletePayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'monopoly' | 'crayon' | 'handshake'>('crayon');

  // Monopoly state
  const [monopolyBill, setMonopolyBill] = useState('₹500 (Crisp Orange Chance Bills)');
  const [monopolySerial, setMonopolySerial] = useState('BOARDWALK-PASS-GO');

  // Crayon Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [crayonColor, setCrayonColor] = useState('#ef4444');
  const [hasDrawn, setHasDrawn] = useState(false);

  // Handshake Hold State
  const [holdingProgress, setHoldingProgress] = useState(0);
  const [isHandshakeComplete, setIsHandshakeComplete] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedMethod === 'crayon' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && !hasDrawn) {
        ctx.fillStyle = '#fefce8'; // parchment/paper
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw faint rule lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let y = 30; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    }
  }, [selectedMethod, hasDrawn]);

  if (!isOpen) return null;

  // Crayon drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = crayonColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Firm handshake hold handlers
  const handleHandshakeMouseDown = () => {
    if (isHandshakeComplete) return;
    sounds.playTick();
    holdIntervalRef.current = window.setInterval(() => {
      setHoldingProgress((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setIsHandshakeComplete(true);
          sounds.playSuccessFanfare();
          return 100;
        }
        return prev + 5; // 2 seconds to reach 100%
      });
    }, 100);
  };

  const handleHandshakeMouseUp = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (!isHandshakeComplete) {
      setHoldingProgress(0);
    }
  };

  const handlePay = () => {
    if (selectedMethod === 'handshake' && !isHandshakeComplete) {
      sounds.playErrorBuzzer();
      alert('Handshake too weak or released early! Hold the button for full 2 seconds while staring unblinkingly at your screen.');
      return;
    }

    const methodLabels = {
      monopoly: 'Monopoly Currency',
      crayon: 'Crayon Written I.O.U. Note',
      handshake: 'Firm & Moist Handshake',
    };

    onCompletePayment(methodLabels[selectedMethod]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-300 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#ffe500]" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Flopkart Insecure Payment Gateway</h3>
              <p className="text-[10px] text-blue-200">100% Guaranteed Transaction Rejection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary Bar */}
        <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-500">Billed Amount:</span>{' '}
            <strong className="text-gray-900 text-sm">₹{totalAmount.toLocaleString()}</strong>
            {surchargeAmount > 0 && (
              <span className="text-red-600 text-[11px] ml-1.5 font-semibold">
                (includes ₹{surchargeAmount} mouse panic fee)
              </span>
            )}
          </div>
          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
            Zero Security Layer
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Select Legally Unenforceable Payment Method:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTick();
                  setSelectedMethod('monopoly');
                }}
                className={`p-2.5 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'monopoly'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold text-gray-800">Monopoly Money</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTick();
                  setSelectedMethod('crayon');
                }}
                className={`p-2.5 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'crayon'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <PenTool className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold text-gray-800">Crayon I.O.U. Note</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTick();
                  setSelectedMethod('handshake');
                }}
                className={`p-2.5 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'handshake'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Handshake className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800">A Firm Handshake</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: MONOPOLY MONEY */}
          {selectedMethod === 'monopoly' && (
            <div className="space-y-3 bg-amber-50/60 p-3.5 rounded border border-amber-200 text-xs">
              <p className="font-bold text-amber-950 flex items-center gap-1">
                <Banknote className="w-4 h-4 text-amber-600" />
                Hasbro Certified Board Currency
              </p>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Bill Denomination:</label>
                <select
                  value={monopolyBill}
                  onChange={(e) => setMonopolyBill(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs outline-none"
                >
                  <option>₹500 (Crisp Orange Chance Bills)</option>
                  <option>₹100 (Slightly Chewed Pink Paper)</option>
                  <option>Park Place Property Title Deed</option>
                  <option>Get Out Of Jail Free Card (Redeemed)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Serial Code:</label>
                <input
                  type="text"
                  value={monopolySerial}
                  onChange={(e) => setMonopolySerial(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs font-mono outline-none"
                />
              </div>
              <p className="text-[10.5px] text-amber-800 italic">
                *Accepted without question at all Flopkart retail branches (all of which do not exist).
              </p>
            </div>
          )}

          {/* METHOD 2: CRAYON I.O.U. NOTE CANVAS */}
          {selectedMethod === 'crayon' && (
            <div className="space-y-2 bg-rose-50/50 p-3.5 rounded border border-rose-200 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-rose-950 flex items-center gap-1">
                  <PenTool className="w-4 h-4 text-rose-600" />
                  Write Your I.O.U. Note with Crayon
                </p>
                <div className="flex items-center gap-1">
                  {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCrayonColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        crayonColor === color ? 'scale-125 ring-2 ring-gray-900 border-white' : 'border-gray-300'
                      }`}
                      title={color}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="ml-2 text-[10px] text-gray-600 hover:underline cursor-pointer"
                  >
                    Clear Note
                  </button>
                </div>
              </div>

              {/* Interactive Canvas */}
              <div className="border-2 border-dashed border-rose-300 rounded overflow-hidden shadow-inner flex justify-center bg-[#fefce8]">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair block max-w-full"
                />
              </div>

              <p className="text-[10px] text-gray-500 text-center">
                ✍️ Scribble: "I promise to pay Flopkart ₹{totalAmount.toLocaleString()} when pigs take flight"
              </p>
            </div>
          )}

          {/* METHOD 3: A FIRM HANDSHAKE (Hold Button) */}
          {selectedMethod === 'handshake' && (
            <div className="space-y-3 bg-emerald-50/60 p-3.5 rounded border border-emerald-200 text-xs text-center">
              <p className="font-bold text-emerald-950 flex items-center justify-center gap-1">
                <Handshake className="w-4 h-4 text-emerald-600" />
                Physical Agreement: Hold to Grip
              </p>
              <p className="text-[11px] text-gray-600 max-w-sm mx-auto">
                Press and hold the button below for 2 continuous seconds to seal the deal with a firm, slightly clammy corporate handshake.
              </p>

              {/* Progress meter */}
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-emerald-600 h-full transition-all duration-75"
                  style={{ width: `${holdingProgress}%` }}
                />
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onMouseDown={handleHandshakeMouseDown}
                  onMouseUp={handleHandshakeMouseUp}
                  onTouchStart={handleHandshakeMouseDown}
                  onTouchEnd={handleHandshakeMouseUp}
                  className={`py-3 px-8 rounded-full font-black text-xs shadow-md transition-all select-none cursor-pointer flex items-center gap-2 ${
                    isHandshakeComplete
                      ? 'bg-emerald-700 text-white cursor-default'
                      : holdingProgress > 0
                      ? 'bg-emerald-500 text-white scale-95'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isHandshakeComplete ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>🤝 Handshake Fully Executed!</span>
                    </>
                  ) : (
                    <span>
                      {holdingProgress > 0
                        ? `Gripping Firmly... (${holdingProgress}%)`
                        : '🤝 PRESS & HOLD TO SHAKE HANDS'}
                    </span>
                  )}
                </button>
              </div>

              {isHandshakeComplete && (
                <p className="text-[10px] text-emerald-700 font-bold">
                  ✓ Bank representative nodded approvingly. Deal is binding in spirit only.
                </p>
              )}
            </div>
          )}

          {/* Pay Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-[#fb641b] hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold py-3.5 px-4 rounded text-sm shadow-lg transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PAY ₹{totalAmount.toLocaleString()} VIA INEFFECTIVE CHANNEL</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              By clicking Pay, you acknowledge that our payment server is a toaster wired to an abacus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
