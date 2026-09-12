import React, { useState } from 'react';
import { Filter, Star, ChevronDown, RotateCcw, AlertOctagon } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SidebarFiltersProps {
  onFilterClick: (filterName: string) => void;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onFilterClick }) => {
  const [priceSlider, setPriceSlider] = useState(499);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const uselessCategories = [
    'Things that smell like copper',
    'Items that look at you when you turn around',
    'Regret',
    'Heavy things that shouldn\'t be heavy',
    'Cold air in a jar',
    'Garments with bad karma',
    'Tools for dismantling hope',
  ];

  const uselessBrands = [
    'Flopkart Basics™',
    'Assembled In A Dark Alley',
    'Authentic Counterfeit',
    'Expired Technologies Ltd.',
  ];

  const uselessRatings = [
    { label: '1★ Only (Our Gold Standard)', count: '94%' },
    { label: '0.5★ or Lower (Despair tier)', count: '4%' },
    { label: '5★ (Obviously Paid Bot Review)', count: '0%' },
  ];

  const handleToggle = (name: string) => {
    if (name.includes('copper')) {
      sounds.playMetallicCoins();
    } else if (name.includes('look at you')) {
      sounds.playCreepyViolin();
    } else if (name.includes('Regret')) {
      sounds.playMelancholySigh();
    } else if (name.includes('Heavy')) {
      sounds.playHeavyThud();
    } else if (name.includes('Cold air')) {
      sounds.playIcyWind();
    } else if (name.includes('karma')) {
      sounds.playVoidDrone();
    } else if (name.includes('hope')) {
      sounds.playSadTrombone();
    } else {
      sounds.playElectricalZap();
    }

    onFilterClick(name);
    setSelectedFilters((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sounds.playRopeCreak();
    const val = Number(e.target.value);
    setPriceSlider(val);
    onFilterClick(`Price ceiling: ₹${val} (Ignored by inventory)`);
  };

  const handleReset = () => {
    sounds.playSadTrombone();
    setSelectedFilters([]);
    onFilterClick('Reset Filters (Nothing changed)');
  };


  return (
    <aside className="bg-white rounded shadow-sm border border-gray-200 divide-y divide-gray-200 text-gray-800 text-xs select-none">
      {/* Filters Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-[#2874f0]" />
          <span>Filters (100% Ineffective)</span>
        </div>
        <button
          onClick={handleReset}
          className="text-[11px] text-[#2874f0] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Categories of Agony */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between font-bold text-gray-700 uppercase tracking-wider text-[11px]">
          <span>Existential Categories</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <div className="space-y-1.5 pt-1">
          {uselessCategories.map((cat, idx) => {
            const isChecked = selectedFilters.includes(cat);
            return (
              <label
                key={idx}
                onClick={() => handleToggle(cat)}
                className="flex items-start gap-2 cursor-pointer hover:text-[#2874f0] transition-colors p-1 rounded hover:bg-blue-50/50"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span className="leading-tight">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Slider (Absurd values) */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between font-bold text-gray-700 uppercase tracking-wider text-[11px]">
          <span>Surprise Budget Filter</span>
        </div>
        <input
          type="range"
          min="-500"
          max="1000000"
          step="5000"
          value={priceSlider}
          onChange={handleSliderChange}
          className="w-full accent-[#2874f0] cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-100">
          <span>Min: -₹500</span>
          <span className="font-bold text-blue-600">Current: ₹{priceSlider.toLocaleString()}</span>
          <span>Max: ₹10L</span>
        </div>
        <p className="text-[10px] text-gray-400 italic">
          *Moving slider alerts warehouse managers to increase your product prices.
        </p>
      </div>

      {/* Customer Ratings */}
      <div className="p-3.5 space-y-2">
        <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
          Customer Ratings
        </div>
        <div className="space-y-1.5 pt-1">
          {uselessRatings.map((rat, idx) => (
            <label
              key={idx}
              onClick={() => handleToggle(rat.label)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded text-[11.5px]"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedFilters.includes(rat.label)}
                  onChange={() => {}}
                  className="cursor-pointer text-blue-600 focus:ring-0"
                />
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{rat.label}</span>
                </div>
              </div>
              <span className="text-gray-400 text-[10px]">{rat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Questionable Brands */}
      <div className="p-3.5 space-y-2">
        <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
          Disreputable Brands
        </div>
        <div className="space-y-1.5 pt-1">
          {uselessBrands.map((brand, idx) => (
            <label
              key={idx}
              onClick={() => handleToggle(brand)}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600 p-1 rounded hover:bg-blue-50/50 text-[11.5px]"
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(brand)}
                onChange={() => {}}
                className="rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Warning Alert Note at bottom */}
      <div className="p-3 bg-red-50/60 text-red-800 text-[11px] flex items-start gap-2">
        <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <p>
          Notice: Flopkart filtering algorithms were permanently retired in 2017 to improve server apathy.
        </p>
      </div>
    </aside>
  );
};
