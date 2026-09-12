import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Gauge } from 'lucide-react';
import type { CartItem } from '../types';
import { ProductThumb } from './ProductThumb';
import { sounds } from '../utils/audio';


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (finalTotal: number, surchargeAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  // Mouse speed tracking
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const [panicSurcharge, setPanicSurcharge] = useState(150);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Evasion mechanics for the Proceed button
  const [evasionCount, setEvasionCount] = useState(0);
  const [buttonOffset, setButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset evasion count whenever cart is reopened
  useEffect(() => {
    if (isOpen) {
      setEvasionCount(0);
      setButtonOffset({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Track mouse speed inside cart
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (lastPosRef.current) {
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        const dt = (now - lastPosRef.current.time) / 1000;

        if (dt > 0.016) {
          const speed = Math.round(Math.hypot(dx, dy) / dt);
          setMouseSpeed(speed);

          // Calculate panic surcharge: base 150 + speed penalty
          const calculatedSurcharge = Math.max(150, Math.floor(speed * 0.42));
          setPanicSurcharge((prev) => Math.max(prev, calculatedSurcharge)); // Locks in highest panic!

          lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
        }
      } else {
        lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const packagingFee = items.length > 0 ? 149 : 0;
  const grandTotal = subtotal + packagingFee + (items.length > 0 ? panicSurcharge : 0);

  // Handle cursor hover evasion
  const handleButtonHover = () => {
    if (evasionCount < 3) {
      sounds.playEvasionBoing();
      const nextCount = evasionCount + 1;
      setEvasionCount(nextCount);

      // Leap randomly within bounds
      const randomX = (Math.random() - 0.5) * 220;
      const randomY = (Math.random() - 0.5) * 80;
      setButtonOffset({ x: randomX, y: randomY });
    }
  };

  const handleCheckoutClick = () => {
    if (evasionCount < 3) {
      handleButtonHover();
      return;
    }
    sounds.playTick();
    onProceedToCheckout(grandTotal, panicSurcharge);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-gray-300 relative animate-in slide-in-from-right duration-200 select-none">
        {/* Header */}
        <div className="p-4 bg-[#2874f0] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ffe500]" />
            <h3 className="font-bold text-base">My Regretful Cart ({items.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Mouse Velocity Surcharge Banner */}
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs">
          <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Panic Surcharge Meter</span>
            </span>
            <span className="font-mono text-sm text-red-600 font-black">
              +₹{panicSurcharge.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-800">
            <span>Mouse Velocity: <strong>{mouseSpeed} px/sec</strong></span>
            <span className="italic text-gray-500">The faster you twitch, the more you pay!</span>
          </div>
          {mouseSpeed > 600 && (
            <p className="text-[10px] text-red-600 font-bold mt-1 animate-bounce">
              ⚠️ High agitation detected! Surcharge has been permanently ratcheted up.
            </p>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-200">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-2xl">
                🛒
              </div>
              <p className="font-bold text-gray-700 text-sm">Your Cart Is Blissfully Empty</p>
              <p className="text-xs text-gray-400 mt-1">
                You currently owe us ₹0. Add items to begin your financial downfall.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="py-3 flex gap-3">
                <div className="w-20 h-20 shrink-0 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
                  <ProductThumb type={product.image} className="w-full h-full" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-[10.5px] text-gray-400 italic line-clamp-1">
                      {product.subtitle}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-black text-gray-900">
                        ₹{(product.price * quantity).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{(product.originalPrice * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-bold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Price Breakdown Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="text-xs space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee (Never Arriving)</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Damaged Packaging Surcharge</span>
                <span>₹{packagingFee}</span>
              </div>
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Mouse Agitation Surcharge</span>
                <span>+₹{panicSurcharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount Due</span>
                <span className="text-[#2874f0]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Evasion Counter Dialogue */}
            <div className="text-center">
              {evasionCount < 3 ? (
                <p className="text-[11px] font-bold text-orange-600 bg-orange-100/70 py-1 px-2 rounded mb-2 inline-block">
                  {evasionCount === 0 && '⚡ Click the button below if you have cat-like reflexes'}
                  {evasionCount === 1 && '💨 Evaded (1/3): Too slow! Try again!'}
                  {evasionCount === 2 && '🏃 Evaded (2/3): Almost had it! One more dodge!'}
                </p>
              ) : (
                <p className="text-[11px] font-bold text-green-700 bg-green-100 py-1 px-2 rounded mb-2 inline-block">
                  ✓ Button exhausted (3/3). You may now proceed!
                </p>
              )}
            </div>

            {/* The Evading Checkout Button Container */}
            <div className="relative h-14 flex items-center justify-center">
              <button
                type="button"
                onMouseEnter={handleButtonHover}
                onClick={handleCheckoutClick}
                style={{
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                  transition: evasionCount < 3 ? 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}
                className={`w-full bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  evasionCount < 3 ? 'ring-2 ring-orange-300' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <span>
                  {evasionCount < 3
                    ? `PROCEED TO CHECKOUT (Evaded ${evasionCount}/3)`
                    : 'PROCEED TO BOGUS PAYMENT →'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
