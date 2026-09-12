import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Printer, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';


interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  totalAmount: number;
  surchargeAmount: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  totalAmount,
  surchargeAmount,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    sounds.playSuccessFanfare();

    // Trigger massive fireworks explosion using canvas-confetti
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: number = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fireworks from left and right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.15, y: Math.random() - 0.2 },
        colors: ['#2874f0', '#ffe500', '#fb641b', '#ef4444', '#10b981'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.85, y: Math.random() - 0.2 },
        colors: ['#2874f0', '#ffe500', '#fb641b', '#ef4444', '#10b981'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const fakeOrderId = `FLOP-${Math.floor(100000 + Math.random() * 900000)}-FAIL`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-300 relative animate-in zoom-in-95 duration-300 print:shadow-none print:border-none">
        {/* Confetti Banner Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-[#ffe500]" />
            <span>Grand Failure Milestone</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
            Transaction Failed Successfully!
          </h2>

          <p className="text-sm sm:text-base font-semibold text-yellow-100 mt-2 max-w-md mx-auto leading-snug drop-shadow-xs">
            Your card was not charged, but your time was thoroughly wasted.
          </p>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Bogus Tax Invoice */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <p className="text-[11px] text-gray-500 font-mono">Invoice #{fakeOrderId}</p>
              <h4 className="font-bold text-gray-900 text-sm">Flopkart Non-Delivery Order</h4>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[10px]">
                STATUS: NEVER COMING
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Method of Extortion:</span>
              <span className="font-bold text-gray-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal Evaluated:</span>
              <span>₹{(totalAmount - surchargeAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Mouse Agitation Penalty:</span>
              <span>+₹{surchargeAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Actual Rupee Deducted:</span>
              <span className="font-black text-green-600">₹0.00 (Zero)</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Spiritual Energy Depleted:</span>
              <span className="font-black text-red-600">100% FATAL</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold text-gray-900">
              <span>Courier Delivery Schedule:</span>
              <span>Before Heat Death of Sun</span>
            </div>
          </div>

          {/* Customer Assurance */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-[11px] text-blue-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
            <p>
              <strong>Flopkart Buyer Protection:</strong> Our logistics warehouse does not possess trucks or dispatch centers. Your non-existent parcel has been permanently marked as "Out for Delivery" forever.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold border border-gray-300 hover:bg-gray-100 py-2 px-3 rounded transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bogus Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="bg-[#2874f0] hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded text-xs shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Suffer More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
