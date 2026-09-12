import React, { useState } from 'react';
import { X, Sparkles, Disc } from 'lucide-react';
import { sounds } from '../utils/audio';


interface WheelOfMisfortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPenalty: (penaltyName: string) => void;
}

const SEGMENTS = [
  { label: '+15% Surcharge', color: '#ef4444', desc: 'Instant 15% price markup added to your next order.' },
  { label: 'Free Broken Promise', color: '#f59e0b', desc: 'We promise your order is coming. It is not.' },
  { label: '+6 Months Delay', color: '#8b5cf6', desc: 'Delivery pushed back 180 business days.' },
  { label: 'Wet Box in Cart', color: '#d97706', desc: 'A slightly damp cardboard box forcefully added to your cart.' },
  { label: 'Mouse Speed 2x', color: '#dc2626', desc: 'Your cursor panic penalty rate is permanently doubled.' },
  { label: 'Zero Hope', color: '#475569', desc: 'No tangible goods won. Spiritual exhaustion increased by 40%.' },
];

export const WheelOfMisfortuneModal: React.FC<WheelOfMisfortuneModalProps> = ({
  isOpen,
  onClose,
  onApplyPenalty,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [outcome, setOutcome] = useState<typeof SEGMENTS[0] | null>(null);

  const spin = () => {
    if (isSpinning) return;

    sounds.playTick();
    setIsSpinning(true);
    setOutcome(null);

    // Random extra spins (5 to 8 full revolutions) + segment offset
    const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetRotation = rotation + fullSpins + (360 - randomSegmentIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = SEGMENTS[randomSegmentIndex];
      setOutcome(chosen);
      sounds.playErrorBuzzer();
      onApplyPenalty(chosen.label);
    }, 4200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-gray-300 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-[#ffe500] animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Daily Wheel of Misfortune</h3>
              <p className="text-[10px] text-blue-200">100% Guaranteed Bad Luck Every Spin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs text-gray-600 max-w-xs">
            Spin once daily to see which unfortunate penalty our warehouse logistics team will impose on your account!
          </p>

          {/* The Spinning Wheel */}
          <div className="relative w-64 h-64 flex items-center justify-center select-none">
            {/* Pointer / Flapper */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-yellow-400 drop-shadow-md" />

            {/* SVG Wheel */}
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              }}
              className="w-56 h-56 rounded-full border-4 border-slate-800 overflow-hidden shadow-2xl relative"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {SEGMENTS.map((seg, i) => {
                  const angle = (360 / SEGMENTS.length);
                  const startAngle = (i * angle - 90) * (Math.PI / 180);
                  const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);

                  const x1 = 50 + 50 * Math.cos(startAngle);
                  const y1 = 50 + 50 * Math.sin(startAngle);
                  const x2 = 50 + 50 * Math.cos(endAngle);
                  const y2 = 50 + 50 * Math.sin(endAngle);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={i}>
                      <path d={pathData} fill={seg.color} stroke="#1e293b" strokeWidth="1" />
                    </g>
                  );
                })}
                {/* Center Hub */}
                <circle cx="50" cy="50" r="12" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
                <text x="50" y="53" textAnchor="middle" fill="#ffe500" fontSize="7" fontWeight="bold">
                  FLOP
                </text>
              </svg>
            </div>
          </div>

          {/* Outcome Banner */}
          {outcome && (
            <div className="bg-red-50 border border-red-300 p-3 rounded text-xs text-red-900 animate-bounce">
              <p className="font-bold text-sm text-red-700">PENALTY AWARDED: {outcome.label}</p>
              <p className="text-[11px] text-red-600 mt-0.5">{outcome.desc}</p>
            </div>
          )}

          {/* Spin Trigger */}
          <button
            type="button"
            disabled={isSpinning}
            onClick={spin}
            className={`w-full py-3 px-6 rounded-lg font-black text-xs shadow-lg transition-transform flex items-center justify-center gap-2 cursor-pointer ${
              isSpinning
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-[#fb641b] hover:bg-orange-600 text-white active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{isSpinning ? 'SPINNING FOR AGONY...' : 'SPIN THE WHEEL OF MISFORTUNE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
