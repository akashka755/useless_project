import React from 'react';
import { Zap, Package, Footprints, AlertOctagon, HelpCircle, Flame, BatteryCharging } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SubNavProps {
  onTriggerFilterAction: (categoryName: string) => void;
}

export const SubNav: React.FC<SubNavProps> = ({ onTriggerFilterAction }) => {
  const categories = [
    {
      name: 'Defective Electronics',
      icon: Zap,
      color: 'text-amber-500',
      sound: () => sounds.playElectricalZap(),
      reaction: '⚡ BZZT! Short-circuit triggered!',
    },
    {
      name: 'Single Shoes',
      icon: Footprints,
      color: 'text-rose-500',
      sound: () => sounds.playLonelyFootstep(),
      reaction: '🥾 Squeak-thud... hopping on one leg!',
    },
    {
      name: 'Existential Goods',
      icon: HelpCircle,
      color: 'text-purple-500',
      sound: () => sounds.playVoidDrone(),
      reaction: '🌌 Gaze into the dark abyss...',
    },
    {
      name: 'Expired Groceries',
      icon: AlertOctagon,
      color: 'text-emerald-500',
      sound: () => sounds.playWetSplat(),
      reaction: '🤢 SQUELCH! Rotten puddle on aisle 4!',
    },
    {
      name: 'Phantom Appliances',
      icon: BatteryCharging,
      color: 'text-blue-500',
      sound: () => sounds.playDyingMotor(),
      reaction: '🔌 SPUTTER... 0 Watts drawn.',
    },
    {
      name: 'Ropes & Strings',
      icon: Package,
      color: 'text-yellow-600',
      sound: () => sounds.playRopeCreak(),
      reaction: '🪢 Creak... TWANG! Jute snapped.',
    },
    {
      name: 'Cardboard Boxes',
      icon: Package,
      color: 'text-orange-500',
      sound: () => sounds.playCardboardSquish(),
      reaction: '📦 Soggy cardboard crushed underfoot.',
    },
    {
      name: 'Zero Off Deals',
      icon: Flame,
      color: 'text-red-500',
      sound: () => sounds.playSadTrombone(),
      reaction: '🎺 WAH-WAH-WAAAH! Saved exactly ₹0.00!',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs mb-3 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 md:gap-8 min-w-max">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                cat.sound();
                onTriggerFilterAction(cat.reaction);
              }}
              className="group flex flex-col items-center gap-1 py-1 px-2 rounded hover:bg-gray-50 transition-all cursor-pointer text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs border border-gray-100">
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <span className="text-[11.5px] font-semibold text-gray-700 group-hover:text-[#2874f0] transition-colors leading-tight max-w-[90px]">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
