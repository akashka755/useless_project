import React, { useState } from 'react';
import { Star, Zap, ShoppingCart, AlertCircle, Sparkles, Lock, Gamepad2 } from 'lucide-react';
import type { Product } from '../types';
import { ProductThumb } from './ProductThumb';
import { sounds } from '../utils/audio';
import { scrambleText, generateRandomScatter } from '../utils/scramble';
import type { ScatterOffset } from '../utils/scramble';


interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onEscapeNotification: (productTitle: string) => void;
  onTriggerDinoGame?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  onEscapeNotification,
  onTriggerDinoGame,
}) => {
  const [isEscaping, setIsEscaping] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);

  // Text scrambling & scattering state
  const [displayTitle, setDisplayTitle] = useState(product.title);
  const [scatterOffset, setScatterOffset] = useState<ScatterOffset | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If item is locked, route to Dino Game
    if (product.isLocked) {
      sounds.playTick();
      if (onTriggerDinoGame) onTriggerDinoGame();
      return;
    }

    // Trigger text scattering and scrambling effect!
    const scatter = generateRandomScatter();
    setScatterOffset(scatter);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.25;
      setDisplayTitle(scrambleText(product.title, progress));
      if (progress >= 1) {
        clearInterval(interval);
        setDisplayTitle(product.title);
        setScatterOffset(null);
      }
    }, 100);

    // 30% chance of escaping the cart!
    const doesEscape = Math.random() < 0.30;

    if (doesEscape) {
      sounds.playEscapeSqueak();
      setIsEscaping(true);
      setEscapeCount((prev) => prev + 1);
      onEscapeNotification(product.title);

      setTimeout(() => {
        setIsEscaping(false);
      }, 700);
      return;
    }

    // Success
    sounds.playTick();
    onAddToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isLocked) {
      sounds.playTick();
      if (onTriggerDinoGame) onTriggerDinoGame();
      return;
    }
    sounds.playTick();
    onAddToCart(product);
    onSelectProduct(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className={`group bg-white rounded shadow-xs hover:shadow-md border border-gray-200 hover:border-blue-400 p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isEscaping ? 'animate-escape ring-2 ring-red-500 bg-red-50/20' : ''
      }`}
    >
      {/* Escape Toast Overlay when escaping */}
      {isEscaping && (
        <div className="absolute inset-0 bg-red-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-3 z-30 animate-pulse">
          <span className="text-3xl mb-1">🏃💨</span>
          <p className="font-extrabold text-sm text-yellow-300">ITEM ESCAPED!</p>
          <p className="text-xs text-red-100 mt-1">
            "{product.title.split('(')[0]}" refused to be purchased and scampered away!
          </p>
          <p className="text-[10px] text-red-200 mt-2 font-mono">Attempt {escapeCount}: Click again quickly!</p>
        </div>
      )}

      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
          product.isLocked
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-blue-50 text-[#2874f0] border-blue-100'
        }`}>
          {product.isLocked ? <Lock className="w-3 h-3 text-red-600" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
          {product.badge || 'Flopkart Minus'}
        </span>
        {escapeCount > 0 && (
          <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
            Escaped {escapeCount}x
          </span>
        )}
      </div>

      {/* Thumbnail Illustration */}
      <div className="relative mb-3 group-hover:scale-[1.02] transition-transform duration-200">
        <ProductThumb type={product.image} className="w-full h-44" />
      </div>

      {/* Details with Text Scattering Transform */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            style={{
              transform: scatterOffset
                ? `translate(${scatterOffset.x}px, ${scatterOffset.y}px) rotate(${scatterOffset.rotate}deg)`
                : 'none',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            className={`text-sm font-bold text-gray-900 group-hover:text-[#2874f0] transition-colors line-clamp-2 leading-snug ${
              scatterOffset ? 'text-red-600 font-mono tracking-widest' : ''
            }`}
          >
            {displayTitle}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{product.subtitle}</p>

          {/* Ratings chip */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </span>
            <span className="text-xs text-gray-500 font-medium">
              ({product.ratingCount.toLocaleString()} dissatisfied reviews)
            </span>
          </div>

          {/* Pricing with Absurd markup and scatter */}
          <div
            style={{
              transform: scatterOffset
                ? `translate(${-scatterOffset.x * 0.5}px, ${scatterOffset.y * 0.5}px)`
                : 'none',
              transition: 'transform 0.3s ease-out',
            }}
            className="mt-3 flex items-baseline gap-2 flex-wrap"
          >
            <span className="text-lg font-black text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              {product.discountText}
            </span>
          </div>

          {/* Bank offer satire */}
          <p className="text-[11px] text-green-700 font-medium mt-1">
            Bank Offer: Pay 15% extra with State Bank of Agony cards
          </p>

          {/* Highlight Spec snippet */}
          <div className="mt-2.5 pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
            {Object.entries(product.specs).slice(0, 2).map(([k, v], idx) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="text-gray-400 font-medium shrink-0">• {k}:</span>
                <span className="text-gray-800 font-semibold truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock & Action buttons */}
        <div className="mt-4 pt-2">
          <p className="text-[10.5px] text-red-600 font-bold mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            {product.stockMessage}
          </p>

          {product.isLocked ? (
            /* Locked Action Button -> Opens Dino Game */
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-900 hover:bg-slate-800 text-[#ffe500] font-black py-2.5 px-3 rounded text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer border border-yellow-500/40"
            >
              <Gamepad2 className="w-4 h-4 text-yellow-400" />
              <span>PLAY DINO RUN TO UNLOCK (100m)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-[#ffe500] hover:bg-yellow-400 active:bg-yellow-500 text-slate-900 font-bold py-2 px-2 rounded text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-[#fb641b] hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-2 px-2 rounded text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
