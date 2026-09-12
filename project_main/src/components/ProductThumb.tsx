import React from 'react';

interface ProductThumbProps {
  type: string;
  className?: string;
}

export const ProductThumb: React.FC<ProductThumbProps> = ({ type, className = 'w-full h-48' }) => {
  switch (type) {
    case 'rope':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100/60 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-amber-800 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            JUTE 100%
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Knot and rough rope twists */}
            <path
              d="M30,80 Q50,40 80,80 T130,80 T80,120 T30,80"
              fill="none"
              stroke="#b45309"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
            <path
              d="M45,75 Q65,35 95,75 T145,75"
              fill="none"
              stroke="#d97706"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Frayed rope hairs */}
            <line x1="24" y1="80" x2="14" y2="76" stroke="#92400e" strokeWidth="3" />
            <line x1="24" y1="82" x2="16" y2="86" stroke="#92400e" strokeWidth="2" />
            <line x1="135" y1="80" x2="146" y2="74" stroke="#92400e" strokeWidth="3" />
            <line x1="135" y1="82" x2="144" y2="87" stroke="#92400e" strokeWidth="2" />
            {/* Mock USB symbol carved with pocket knife */}
            <circle cx="80" cy="80" r="12" fill="#78350f" />
            <text x="80" y="84" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">0V</text>
          </svg>
          <span className="text-xs font-semibold text-amber-900 mt-2">Zero Electrons Transferred</span>
        </div>
      );

    case 'capsule':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-blue-100/60 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            0% H2O
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Pill capsule (clear shell) */}
            <g transform="rotate(-30 80 80)">
              {/* Left half - totally transparent with gloss */}
              <rect x="40" y="65" width="40" height="30" rx="15" fill="rgba(56, 189, 248, 0.25)" stroke="#0284c7" strokeWidth="3" />
              {/* Right half - empty plastic */}
              <rect x="80" y="65" width="40" height="30" rx="15" fill="rgba(255, 255, 255, 0.4)" stroke="#0284c7" strokeWidth="3" />
              {/* Center dividing line */}
              <line x1="80" y1="65" x2="80" y2="95" stroke="#0369a1" strokeWidth="2" />
              {/* Shine highlights */}
              <path d="M48,70 Q60,70 70,70" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Air particles */}
            <circle cx="50" cy="45" r="3" fill="#38bdf8" opacity="0.6" />
            <circle cx="115" cy="50" r="4" fill="#38bdf8" opacity="0.4" />
            <circle cx="120" cy="115" r="3" fill="#38bdf8" opacity="0.5" />
          </svg>
          <span className="text-xs font-semibold text-sky-800 mt-2">100% Dehydrated Vacuum</span>
        </div>
      );

    case 'shoe':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-200/80 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            LEFT FOOT ONLY
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Sneaker shape facing left */}
            <path
              d="M30,110 L130,110 Q140,105 135,90 L120,70 Q110,65 95,80 L70,85 L35,95 Q25,100 30,110 Z"
              fill="#e11d48"
              stroke="#9f1239"
              strokeWidth="3"
            />
            {/* Sole */}
            <rect x="25" y="110" width="115" height="12" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            {/* Scuff marks on the toe */}
            <path d="M28,102 Q35,98 42,106" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
            <path d="M32,96 Q40,94 38,102" stroke="#44403c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="34" cy="107" r="2" fill="#292524" />
            {/* Laces */}
            <line x1="85" y1="82" x2="95" y2="82" stroke="white" strokeWidth="2" />
            <line x1="90" y1="76" x2="100" y2="76" stroke="white" strokeWidth="2" />
          </svg>
          <span className="text-xs font-semibold text-stone-700 mt-2">Right Shoe: ₹999/Month</span>
        </div>
      );

    case 'hanger':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/80 to-orange-100/60 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            CLOAK INVISIBLE
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Swivel metal hook */}
            <path
              d="M80,45 C80,30 95,30 95,40 C95,50 80,50 80,65"
              fill="none"
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Wooden coat hanger triangle */}
            <polygon points="80,65 140,105 20,105" fill="#b45309" stroke="#78350f" strokeWidth="4" strokeLinejoin="round" />
            {/* Crossbar */}
            <line x1="20" y1="105" x2="140" y2="105" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
            {/* Dotted outline representing the "Invisible Cloak" */}
            <path
              d="M25,108 L15,145 Q80,155 145,145 L135,108"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            <text x="80" y="135" textAnchor="middle" fill="#9333ea" fontSize="9" fontStyle="italic">
              [Cloak Currently Active]
            </text>
          </svg>
          <span className="text-xs font-semibold text-amber-900 mt-2">Wooden Suit Hanger (Cloak included)</span>
        </div>
      );

    case 'flashlight':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-amber-100/70 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            DAYLIGHT ONLY
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Big Sun beaming down directly */}
            <circle cx="80" cy="30" r="14" fill="#f59e0b" />
            <g stroke="#f59e0b" strokeWidth="2">
              <line x1="80" y1="10" x2="80" y2="5" />
              <line x1="80" y1="50" x2="80" y2="55" />
              <line x1="60" y1="30" x2="55" y2="30" />
              <line x1="100" y1="30" x2="105" y2="30" />
            </g>
            {/* Flashlight body */}
            <rect x="65" y="80" width="30" height="55" rx="5" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            {/* Solar panel on handle */}
            <rect x="70" y="90" width="20" height="25" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
            {/* Flashlight Head */}
            <polygon points="60,80 100,80 110,65 50,65" fill="#475569" stroke="#0f172a" strokeWidth="2" />
            {/* Feeble light cone towards the sun */}
            <polygon points="52,65 108,65 120,40 40,40" fill="rgba(250, 204, 21, 0.35)" />
          </svg>
          <span className="text-xs font-semibold text-yellow-900 mt-2">Zero Night Functionality</span>
        </div>
      );

    case 'button':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-red-100/70 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            DO NOT CLICK
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Yellow warning base */}
            <rect x="25" y="60" width="110" height="60" rx="10" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
            {/* Black danger stripes */}
            <line x1="35" y1="120" x2="50" y2="60" stroke="#1f2937" strokeWidth="5" />
            <line x1="65" y1="120" x2="80" y2="60" stroke="#1f2937" strokeWidth="5" />
            <line x1="95" y1="120" x2="110" y2="60" stroke="#1f2937" strokeWidth="5" />
            {/* Giant Big Red Dome Button */}
            <ellipse cx="80" cy="70" rx="35" ry="22" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
            <ellipse cx="80" cy="65" rx="32" ry="18" fill="#dc2626" />
            {/* Highlight */}
            <ellipse cx="73" cy="61" rx="14" ry="7" fill="rgba(255,255,255,0.6)" />
          </svg>
          <span className="text-xs font-semibold text-red-900 mt-2">Glued Rigid: 0mm Travel</span>
        </div>
      );

    case 'card':
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 rounded-lg relative overflow-hidden border border-neutral-700 shadow-xl ${className}`}>
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            LOCKED ITEM
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-2xl">
            {/* Obsidian Metallic Credit Card */}
            <rect x="15" y="45" width="130" height="75" rx="8" fill="#171717" stroke="#fbbf24" strokeWidth="2" />
            {/* Gold EMV Chip */}
            <rect x="30" y="60" width="22" height="18" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            <line x1="30" y1="69" x2="52" y2="69" stroke="#b45309" strokeWidth="1" />
            <line x1="41" y1="60" x2="41" y2="78" stroke="#b45309" strokeWidth="1" />
            {/* Cardholder name and number */}
            <text x="30" y="94" fill="#a3a3a3" fontSize="8" fontFamily="monospace" letterSpacing="1">
              4040 •••• •••• DEBT
            </text>
            <text x="30" y="107" fill="#fbbf24" fontSize="7" fontWeight="bold">
              SCHRÖDINGER GUEST
            </text>
            {/* Flopkart Minus hologram logo */}
            <circle cx="125" cy="98" r="10" fill="#dc2626" opacity="0.8" />
            <circle cx="115" cy="98" r="10" fill="#f59e0b" opacity="0.8" />
          </svg>
          <span className="text-xs font-semibold text-amber-400 mt-2">Unlimited Negative Balance</span>
        </div>
      );

    case 'box':

    default:
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b from-stone-100 to-amber-100/80 p-4 rounded-lg relative overflow-hidden ${className}`}>
          <div className="absolute top-2 right-2 bg-stone-700 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            MOISTURE 87%
          </div>
          <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-md">
            {/* Collapsed cardboard box */}
            <polygon points="30,60 80,40 130,60 120,115 75,130 25,110" fill="#92400e" stroke="#78350f" strokeWidth="3" />
            {/* Top flaps sagging */}
            <polygon points="30,60 70,75 80,40" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <polygon points="80,40 90,75 130,60" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            {/* Water stains / damp spots */}
            <ellipse cx="60" cy="95" rx="18" ry="10" fill="#573014" opacity="0.6" />
            <ellipse cx="95" cy="105" rx="12" ry="8" fill="#573014" opacity="0.5" />
            {/* Raindrops dripping */}
            <circle cx="50" cy="125" r="2" fill="#38bdf8" />
            <circle cx="95" cy="130" r="2.5" fill="#38bdf8" />
          </svg>
          <span className="text-xs font-semibold text-stone-800 mt-2">Universal Search Result</span>
        </div>
      );
  }
};
