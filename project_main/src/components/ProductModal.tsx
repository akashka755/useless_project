import React from 'react';
import { X, Star, ShoppingCart, Zap, ShieldAlert, CheckCircle2, ThumbsUp, HelpCircle } from 'lucide-react';
import type { Product } from '../types';
import { ProductThumb } from './ProductThumb';
import { sounds } from '../utils/audio';


interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onEscapeNotification: (title: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onEscapeNotification,
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    // 30% chance of escape
    if (Math.random() < 0.30) {
      sounds.playEscapeSqueak();
      onEscapeNotification(product.title);
      alert(`🏃💨 WHOOSH! ${product.title.split('(')[0]} leaped out of the checkout modal and hid under your bed! Click again.`);
      return;
    }
    sounds.playTick();
    onAddToCart(product);
    alert(`Added to cart! (Warning: Item might still try to run away before checkout).`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-300 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Close */}
        <div className="p-3.5 bg-[#2874f0] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#ffe500] text-blue-900 px-2 py-0.5 rounded">
              FLOPKART EXCLUSIVE
            </span>
            <span className="text-xs text-blue-100 italic">Item ID: {product.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Image & Direct Actions (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="border border-gray-200 rounded p-4 bg-gray-50 flex items-center justify-center">
              <ProductThumb type={product.image} className="w-full h-64" />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-[#ffe500] hover:bg-yellow-400 text-slate-900 font-extrabold py-3 px-4 rounded text-sm shadow transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                }}
                className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded text-sm shadow transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Warranty note */}
            <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-red-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-700">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Non-Warranty Disclaimer</span>
              </div>
              <p className="text-[11.5px] leading-relaxed">{product.warranty}</p>
            </div>
          </div>

          {/* Right Column: Detailed Product Specs & Satirical Reviews (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 italic">{product.subtitle}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-2.5">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  {product.ratingCount.toLocaleString()} Verified Victims
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  {product.discountText}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                + ₹199 Packaging Fee (for sending it in a torn envelope)
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Product Description
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-white border border-gray-100 p-2.5 rounded">
                {product.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Key Disadvantages
              </h4>
              <ul className="text-xs text-gray-600 space-y-1 pl-1">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Technical Specifications
              </h4>
              <div className="border border-gray-200 rounded overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-1.5 px-3 font-medium text-gray-500 w-2/5 border-b border-gray-100">
                          {key}
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-gray-800 border-b border-gray-100">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            {product.faqs && product.faqs.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>Customer Questions & Confusions</span>
                </h4>
                <div className="space-y-2">
                  {product.faqs.map((faq, i) => (
                    <div key={i} className="bg-blue-50/50 border border-blue-100 p-2.5 rounded text-xs">
                      <p className="font-bold text-blue-950">Q: {faq.question}</p>
                      <p className="text-gray-700 mt-1 italic">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Heartbreaking Customer Reviews
              </h4>
              <div className="space-y-2">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="border border-gray-200 rounded p-3 text-xs bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <span>{rev.rating}</span>
                          <Star className="w-2.5 h-2.5 fill-white" />
                        </span>
                        <span className="font-bold text-gray-900">{rev.title}</span>
                      </div>
                      <span className="text-gray-400 text-[10px]">{rev.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-gray-100">
                      <span>{rev.author} (Certified Regretful Buyer)</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <ThumbsUp className="w-3 h-3" /> {rev.helpfulCount} found this relatable
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
