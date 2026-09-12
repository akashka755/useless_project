import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flame, AlertTriangle, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

const BANNERS = [
  {
    id: 1,
    bgGradient: 'from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]',
    tag: 'ANNUAL FESTIVAL OF APATHY',
    title: '0% OFF SALE!',
    subtitle: 'Pay exactly full price today! Not a single rupee discounted.',
    disclaimer: '*Prices may actually be inflated by 12% to cover festival decoration expenses.',
    badge: 'Limited Stock • Maximum Price',
    ctaText: 'Shop at Full Price',
    accentColor: '#ffe500',
    icon: Flame,
  },
  {
    id: 2,
    bgGradient: 'from-[#7f1d1d] via-[#991b1b] to-[#b91c1c]',
    tag: 'SCHEDULED INFRASTRUCTURE DISASTER',
    title: 'BIG BILLION OUTAGES',
    subtitle: 'Our servers will be completely down this Friday! Save nothing, buy nothing.',
    disclaimer: '*Engineers will be actively spilling coffee on the database clusters starting 00:01 AM.',
    badge: '404 Guaranteed • Cloud Meltdown',
    ctaText: 'Experience Server Error',
    accentColor: '#fbbf24',
    icon: AlertTriangle,
  },
  {
    id: 3,
    bgGradient: 'from-[#064e3b] via-[#047857] to-[#059669]',
    tag: 'TURBO UNRELIABLE LOGISTICS',
    title: 'EXPRESS SHIPPING: 14 - 26 MONTHS',
    subtitle: 'We hand-deliver via pigeon cart across major intercontinental waterways.',
    disclaimer: '*Package may be consumed by wildlife or lost at sea during transit.',
    badge: 'Track Nothing • Wait Forever',
    ctaText: 'Place Order & Forget',
    accentColor: '#a7f3d0',
    icon: ArrowRight,
  },
];

interface HeroBannerProps {
  onDealClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onDealClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Countdown timer state for "Deal of the Minute"
  // Whenever it hits 0 (or randomly), it resets to a random higher number or adds minutes!
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 43 });
  const [dealStatusMessage, setDealStatusMessage] = useState('Ending soon! Hurry up!');

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Runaway countdown timer logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        // Random 10% chance to suddenly freak out and increase time!
        const randomPanic = Math.random() < 0.08;
        if (randomPanic) {
          const addedMinutes = Math.floor(Math.random() * 8) + 2;
          const addedSeconds = Math.floor(Math.random() * 50) + 10;
          setDealStatusMessage(`⚠️ Deal extended by ${addedMinutes}m ${addedSeconds}s due to negative sales!`);
          sounds.playTick();
          return { minutes: addedMinutes, seconds: addedSeconds };
        }

        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Reached 00:00! Randomly reset to absurd time!
          const newMins = Math.floor(Math.random() * 14) + 3;
          const newSecs = Math.floor(Math.random() * 59);
          setDealStatusMessage('⏰ Timer hit zero! Extended indefinitely because nobody bought anything.');
          sounds.playEscapeSqueak();
          return { minutes: newMins, seconds: newSecs };
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const banner = BANNERS[currentSlide];
  const BannerIcon = banner.icon;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Massive Carousel Banner (8 cols) */}
        <div className="lg:col-span-8 relative rounded overflow-hidden shadow-sm h-64 sm:h-72 bg-gray-900 group">
          <div
            className={`w-full h-full bg-gradient-to-r ${banner.bgGradient} p-6 sm:p-8 flex flex-col justify-between text-white relative transition-all duration-700`}
          >
            {/* Background watermark pattern */}
            <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none select-none">
              <BannerIcon className="w-56 h-56 text-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xs text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
                <span>{banner.tag}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow">
                {banner.title}
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-medium max-w-lg mt-1 drop-shadow-xs">
                {banner.subtitle}
              </p>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playErrorBuzzer();
                    alert('Sale Error: Server attempted to give 0% discount, but applied a ₹150 convenience penalty instead.');
                  }}
                  className="bg-[#ffe500] hover:bg-yellow-400 text-slate-900 font-extrabold px-6 py-2.5 rounded text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  {banner.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-white/70 italic max-w-xs leading-tight">
                  {banner.disclaimer}
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-r flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-l flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-[#ffe500]' : 'w-2 bg-white/50'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Deal of the Minute Runway Widget (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                <h3 className="font-bold text-gray-900 text-base">Deal of the Minute</h3>
              </div>
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                Random Reset
              </span>
            </div>

            {/* The Absurd Countdown Timer */}
            <div className="my-4 bg-slate-900 text-white rounded p-3 text-center relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-center gap-2 font-mono text-3xl font-black tracking-widest text-[#ffe500]">
                <Clock className="w-6 h-6 text-red-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>
                  {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1.5 font-medium transition-all duration-300">
                {dealStatusMessage}
              </p>
            </div>

            <div className="text-xs text-gray-600 space-y-1.5 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded">
              <p className="font-semibold text-amber-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Warning: Time Travel in Progress
              </p>
              <p className="text-[11px] text-amber-800">
                Whenever this countdown strikes 00:00, our quantum chronometer re-adds 3 to 15 minutes to guarantee you never miss out on missing out.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playEvasionBoing();
              onDealClick();
            }}
            className="w-full mt-3 bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs shadow transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Claim Infinite Deal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
