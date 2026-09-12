import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SubNav } from './components/SubNav';
import { HeroBanner } from './components/HeroBanner';
import { SidebarFilters } from './components/SidebarFilters';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SuccessModal } from './components/SuccessModal';
import { DinoGameModal } from './components/DinoGameModal';
import { WheelOfMisfortuneModal } from './components/WheelOfMisfortuneModal';
import { HostileChatbot } from './components/HostileChatbot';
import { Footer } from './components/Footer';
import { FLOP_PRODUCTS, TROLL_SEARCH_PRODUCT } from './data/products';
import type { Product, CartItem, UserProfile } from './types';
import { sounds } from './utils/audio';
import { ShieldAlert, Sparkles } from 'lucide-react';

export function App() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('flopkart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('flopkart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDinoGameOpen, setIsDinoGameOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  // Unlocked items state (e.g. via Dino game)
  const [unlockedProductIds, setUnlockedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flop_unlocked_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio mute state
  const [isMuted, setIsMuted] = useState(sounds.isMuted);

  // Visual effects state
  const [isRedFlashing, setIsRedFlashing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout info
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutSurcharge, setCheckoutSurcharge] = useState(0);
  const [paymentMethodUsed, setPaymentMethodUsed] = useState('');

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('flopkart_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  // Save user to local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('flopkart_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('flopkart_user');
      }
    } catch {
      // Ignore
    }
  }, [user]);

  // Save unlocked items
  useEffect(() => {
    try {
      localStorage.setItem('flop_unlocked_items', JSON.stringify(unlockedProductIds));
    } catch {
      // Ignore
    }
  }, [unlockedProductIds]);

  // Trigger useless filter red screen flash
  const triggerUselessFilterAction = (filterName: string) => {
    setIsRedFlashing(true);
    showToast(`⚠️ Filter "${filterName}" applied! (Algorithm completely ignored your request)`);
    setTimeout(() => {
      setIsRedFlashing(false);
    }, 650);
  };


  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Sound toggle
  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    showToast(muted ? '🔇 Flopkart sound muted' : '🔊 Flopkart satirical sound effects enabled');
  };

  // Unlock item helper from mini-game
  const handleUnlockItem = (productId: string) => {
    if (!unlockedProductIds.includes(productId)) {
      setUnlockedProductIds((prev) => [...prev, productId]);
    }
    showToast('🎉 CONGRATULATIONS! Product unlocked in your catalog!');
  };

  // Apply penalty from Wheel of Misfortune
  const handleApplyWheelPenalty = (penalty: string) => {
    if (penalty.includes('Wet Box')) {
      handleAddToCart(TROLL_SEARCH_PRODUCT);
      showToast('📦 The Wheel forcefully placed a soggy cardboard box into your cart!');
    } else {
      showToast(`🎯 The Wheel of Misfortune has bestowed: "${penalty}"!`);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`✓ Added "${product.title.split('(')[0].trim()}" to cart (if it doesn't escape later).`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    sounds.playTick();
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    sounds.playEscapeSqueak();
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Item banished from cart.');
  };

  const handleEscapeNotification = (productTitle: string) => {
    showToast(`🏃💨 "${productTitle.split('(')[0].trim()}" escaped your cart! Click again before it runs!`);
  };

  const handleProceedToCheckout = (total: number, surcharge: number) => {
    setCheckoutTotal(total);
    setCheckoutSurcharge(surcharge);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompletePayment = (method: string) => {
    setPaymentMethodUsed(method);
    setIsCheckoutOpen(false);
    setCartItems([]); // empty cart
    setIsSuccessOpen(true);
  };

  // If user searched for ANYTHING, return strictly the Damp Box!
  const isSearchActive = searchQuery.trim().length > 0;
  const baseCatalog = isSearchActive ? [TROLL_SEARCH_PRODUCT] : FLOP_PRODUCTS;

  // Compute dynamic lock status
  const displayedProducts = baseCatalog.map((prod) => {
    if (prod.id === 'prod-infinite-debt') {
      const isNowUnlocked = unlockedProductIds.includes(prod.id);
      return {
        ...prod,
        isLocked: !isNowUnlocked,
        badge: isNowUnlocked ? 'UNLOCKED • Black Edition' : 'LOCKED • Play Dino Run',
      };
    }
    return prod;
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-gray-800 flex flex-col relative font-sans">
      {/* Red Flash Screen Vignette for Useless Filters */}
      {isRedFlashing && (
        <div className="fixed inset-0 z-50 pointer-events-none flash-red" />
      )}

      {/* Persistent Floating Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md text-center">
          <Sparkles className="w-4 h-4 text-[#ffe500] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWheel={() => setIsWheelOpen(true)}
        onOpenDinoGame={() => setIsDinoGameOpen(true)}
        user={user}
        onLogout={() => {
          sounds.playTick();
          setUser(null);
          showToast('Signed out. Your existential data has been permanently discarded.');
        }}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Secondary Categories Ribbon */}
      <SubNav onTriggerFilterAction={triggerUselessFilterAction} />

      {/* Hero Carousel & Runaway Deal Countdown */}
      {!isSearchActive && (
        <HeroBanner
          onDealClick={() => {
            const randProd = FLOP_PRODUCTS[Math.floor(Math.random() * FLOP_PRODUCTS.length)];
            setSelectedProduct(randProd);
          }}
        />
      )}

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Useless Sidebar Filters (3 cols on desktop) */}
          <div className="lg:col-span-3">
            <div className="sticky top-16 space-y-3">
              <SidebarFilters onFilterClick={triggerUselessFilterAction} />

              {/* Parody Flipkart Plus Ad Banner */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-3.5 rounded shadow-sm text-xs space-y-1.5 border border-blue-800">
                <div className="flex items-center gap-1 font-black text-[#ffe500]">
                  <span>Flopkart Minus ✦</span>
                  <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">
                    Anti-VIP
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 leading-snug">
                  Earn Negative SuperCoins with every delayed package. Redeem coins to increase your shipping costs!
                </p>
                <button
                  onClick={() => alert('Minus Membership Activated: ₹499 deducted from your future reincarnations.')}
                  className="w-full bg-[#ffe500] hover:bg-yellow-400 text-slate-900 font-extrabold py-1.5 rounded text-[11px] mt-1 cursor-pointer"
                >
                  Join Minus Today
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Product Grid & Search Results (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header / Results Counter */}
            <div className="bg-white p-3.5 rounded shadow-xs border border-gray-200 flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-gray-900 m-0">
                  {isSearchActive ? (
                    <span className="flex items-center gap-2">
                      <span>Showing 1 of 1 Universal Results for</span>
                      <span className="text-[#2874f0]">"{searchQuery}"</span>
                    </span>
                  ) : (
                    'The Product Catalog from Hell (Featured Useless Inventions)'
                  )}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isSearchActive
                    ? 'Our proprietary algorithm has determined that all human searches correspond to wet cardboard.'
                    : 'Engineered with zero utility, aggressive markups, and text scattering effects.'}
                </p>
              </div>

              {isSearchActive && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#2874f0] font-bold hover:underline shrink-0 cursor-pointer"
                >
                  Clear Search & View All
                </button>
              )}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onEscapeNotification={handleEscapeNotification}
                  onTriggerDinoGame={() => setIsDinoGameOpen(true)}
                />
              ))}
            </div>

            {/* Satirical Quality Assurance Banner */}
            <div className="bg-white rounded p-4 border border-dashed border-gray-300 text-center text-xs text-gray-500 space-y-1 my-4">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mb-1">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <p className="font-bold text-gray-700">Flopkart Defect Guarantee™</p>
              <p className="max-w-md mx-auto text-[11px]">
                If your product arrives functional or in working order, please return it immediately so our quality destruction team can break it properly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onEscapeNotification={handleEscapeNotification}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          showToast(`Logged in as ${u.name} (${u.tier})`);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={checkoutTotal}
        surchargeAmount={checkoutSurcharge}
        onCompletePayment={handleCompletePayment}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        paymentMethod={paymentMethodUsed}
        totalAmount={checkoutTotal}
        surchargeAmount={checkoutSurcharge}
      />

      <DinoGameModal
        isOpen={isDinoGameOpen}
        onClose={() => setIsDinoGameOpen(false)}
        onUnlockItem={handleUnlockItem}
        isUnlocked={unlockedProductIds.includes('prod-infinite-debt')}
      />

      <WheelOfMisfortuneModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onApplyPenalty={handleApplyWheelPenalty}
      />

      {/* Floating Hostile Customer Support Live Chat */}
      <HostileChatbot />

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
}

export default App;
