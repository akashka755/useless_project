import React, { useState } from 'react';
import { Search, ShoppingCart, User, Volume2, VolumeX, AlertCircle, X, Disc, Gamepad2 } from 'lucide-react';
import type { UserProfile } from '../types';
import { sounds } from '../utils/audio';
import { scrambleText } from '../utils/scramble';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenWheel: () => void;
  onOpenDinoGame: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenWheel,
  onOpenDinoGame,
  user,
  onLogout,
  isMuted,
  onToggleMute,
}) => {
  const [cartLabel, setCartLabel] = useState('Cart');
  const [isScrambling, setIsScrambling] = useState(false);

  // Scramble cart text on hover or click
  const handleScrambleCart = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.2;
      setCartLabel(scrambleText('Cart ($#@!)', progress));
      if (progress >= 1) {
        clearInterval(interval);
        setCartLabel('Cart');
        setIsScrambling(false);
      }
    }, 60);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand Logo */}
        <div className="flex flex-col items-start cursor-pointer select-none shrink-0" onClick={() => setSearchQuery('')}>
          <div className="flex items-center gap-0.5">
            <span className="text-2xl font-black italic tracking-tighter text-white drop-shadow-sm">
              Flop<span className="text-[#ffe500]">kart</span>
            </span>
          </div>
          <a
            href="#explore-minus"
            onClick={(e) => { e.preventDefault(); alert('Minus Membership: You pay us ₹500/month and we deliver items to the wrong address.'); }}
            className="text-[10.5px] italic text-blue-100 flex items-center gap-1 hover:underline -mt-1 font-medium"
          >
            Explore <span className="text-[#ffe500] font-bold">Minus</span>
            <span className="text-[#ffe500] text-xs font-black">✦</span>
          </a>
        </div>

        {/* Top Search Bar (Persistent Useless Search) */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center bg-white rounded-xs shadow-sm overflow-hidden text-gray-800">
            <input
              type="text"
              placeholder="Search for phones, clothes, happiness, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-4 pr-10 text-sm outline-none placeholder:text-gray-400 placeholder:italic font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors mr-1 cursor-pointer"
                title="Clear useless search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {}}
              className="px-3.5 py-2 text-[#2874f0] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs px-3 py-1.5 rounded shadow-lg flex items-center gap-2 z-50 animate-bounce">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Search query <strong>"{searchQuery}"</strong> ignored. Algorithm determined you need a cardboard box.
              </span>
            </div>
          )}
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
          {/* Wheel of Misfortune Trigger */}
          <button
            onClick={() => {
              sounds.playTick();
              onOpenWheel();
            }}
            className="flex items-center gap-1 bg-amber-400 hover:bg-yellow-300 text-slate-900 px-2.5 py-1.5 rounded-xs font-black text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Daily Wheel of Misfortune"
          >
            <Disc className="w-4 h-4 text-red-700 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">Spin Misfortune</span>
          </button>

          {/* Dino Game Trigger */}
          <button
            onClick={() => {
              sounds.playTick();
              onOpenDinoGame();
            }}
            className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-[#ffe500] px-2.5 py-1.5 rounded-xs font-bold text-xs border border-blue-600 transition-colors cursor-pointer"
            title="Play Depressed Dinosaur Run"
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden md:inline">Dino Run</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-full hover:bg-blue-700/60 transition-colors text-white/90 hover:text-white cursor-pointer"
            title={isMuted ? 'Unmute Satirical Audio' : 'Mute Satirical Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-200" /> : <Volume2 className="w-5 h-5 text-[#ffe500]" />}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 bg-white text-[#2874f0] px-3.5 py-1.5 rounded-xs font-semibold text-sm shadow-xs hover:bg-blue-50 transition-all cursor-pointer">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[100px]">{user.name}</span>
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-1 w-56 bg-white text-gray-800 shadow-xl rounded border border-gray-100 p-2 text-xs z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user.tier}</p>
                  <p className="text-gray-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-amber-600 mt-1">Coord: {user.bermudaCoordinates}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-2 py-1.5 text-red-600 font-semibold hover:bg-red-50 rounded mt-1 cursor-pointer"
                >
                  Sign Out (Permanently Unforgiven)
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playTick();
                onOpenAuth();
              }}
              className="bg-white text-[#2874f0] hover:bg-blue-50 px-4 py-1.5 rounded-xs font-semibold text-sm shadow-xs transition-all tracking-wide cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Cart Icon with badge & Text Scramble */}
          <button
            onMouseEnter={handleScrambleCart}
            onClick={() => {
              handleScrambleCart();
              onOpenCart();
            }}
            className="flex items-center gap-2 text-white font-semibold text-sm hover:text-[#ffe500] transition-colors relative py-1 px-2 cursor-pointer font-mono"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#ffe500] text-blue-900 text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline min-w-[36px] text-left">{cartLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
