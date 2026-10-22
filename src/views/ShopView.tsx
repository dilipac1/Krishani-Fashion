import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, X, Heart, MessageCircle, Phone, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2, Layers, Box, Tag, Smartphone } from 'lucide-react';
import { Product } from '../types';
import { formatCategoryName } from '../lib/translations';
import { WaterRippleButton } from '../components/WaterRippleButton';

import { usePWAInstall } from '../hooks/usePWAInstall';

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.75 7.84 19L7.54 18.82L4.42 19.64L5.25 16.6L5.05 16.29C4.3 15.03 3.9 13.59 3.9 12.11C3.9 7.57 7.6 3.87 12.14 3.87C14.34 3.87 16.41 4.73 17.96 6.29C19.51 7.85 20.37 9.92 20.37 12.12C20.37 16.66 16.67 20.36 12.13 20.36L12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.14 13.55 13.67 14.11 13.53 14.27C13.39 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.94 11 13.1C10.26 12.44 9.77 11.63 9.62 11.38C9.48 11.13 9.6 11 9.73 10.87C9.84 10.76 9.98 10.58 10.1 10.44C10.22 10.3 10.27 10.19 10.35 10.03C10.43 9.86 10.39 9.72 10.33 9.6C10.27 9.48 9.77 8.26 9.57 7.76C9.37 7.28 9.16 7.34 9.01 7.33H8.53C8.36 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.47 7.02 9.66C7.02 10.85 7.89 12 8.01 12.16C8.13 12.33 9.72 14.77 12.15 15.82C12.73 16.07 13.18 16.22 13.53 16.33C14.11 16.51 14.64 16.49 15.06 16.43C15.53 16.36 16.53 15.83 16.73 15.26C16.93 14.69 16.93 14.2 16.87 14.09C16.81 13.99 16.65 13.93 16.4 13.81L16.56 13.99Z" />
  </svg>
);

const AppleIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.96 0-2.04-.54-3.03-.54-.99 0-2.18.54-3.01.54-1.95 0-5.01-4.04-5.01-8.54 0-4.6 2.41-6.95 4.8-6.95 1.05 0 2.03.45 2.83.45.8 0 1.9-.45 3.03-.45 2.45 0 4.35 1.83 4.35 4.54a11.1 11.1 0 01-2.05 6.38c-1.16 1.63-1.89 4.57-2.91 4.57zm-3.03-16.71c0-2.22 1.81-3.57 1.81-3.57s.11.15.11.36c0 2.08-1.92 3.55-1.92 3.55s-.08-.12-.08-.34h.08z" />
  </svg>
);

const PlayStoreIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.523 15.3l-3.108-3.3 3.108-3.3 3.446 1.957c.98.556.98 1.463 0 2.02l-3.446 1.957zM12.03 12L3.06 21c-.419-.44-.653-1.132-.653-2.02V5.02c0-.888.234-1.58.653-2.02L12.03 12zM13.273 13.323L16.29 16.53l-10.435 5.922c-.645.366-1.218.326-1.61-.044L13.273 13.323zM13.273 10.677L4.245 1.592c.392-.37 1.107-.41 1.61-.044l10.435 5.922l-3.017 3.207z"/>
  </svg>
);

const IOSGuideModal = ({ show, onClose, t }: { show: boolean, onClose: () => void, t: any }) => (
  <AnimatePresence>
    {show && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-rose-500 to-pink-500" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#D81B60]">
              <Smartphone size={24} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <h3 className="text-lg font-serif font-black text-[#292929] mb-4">{t('howToInstall')}</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs">1</div>
              <p className="text-sm font-bold text-gray-800 leading-snug">{t('step1')}</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-black text-xs">2</div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-snug">{t('step2')}</p>
                <div className="mt-2 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-blue-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-black text-xs">3</div>
              <p className="text-sm font-bold text-gray-800 leading-snug">{t('step3')}</p>
            </div>
          </div>
          <WaterRippleButton onClick={onClose} className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
            {t('gotIt')}
          </WaterRippleButton>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);


export const ShopView = ({ navigateTo, onAdminTrigger, activeTab }: { navigateTo: (tab: string) => void, onAdminTrigger?: () => void, activeTab?: string }) => {
  const { products, cart, addToCart, lang, setLang, t, availableCategories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isInstallable, isIOS, install } = usePWAInstall();
  const categoryRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (activeTab === 'categories' && categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  const categories = useMemo(() => {
    const cats = new Set(['All', ...(availableCategories || [])]);
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products, availableCategories]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tapCount = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    if (tapCount.current >= 5 && onAdminTrigger) {
      onAdminTrigger();
      tapCount.current = 0;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const handleAddToCart = () => {
    if (!selectedProduct || selectedProduct.inStock === false) return;
    const hasSizes = Boolean(selectedProduct.sizes && selectedProduct.sizes.length > 0);
    if (hasSizes && !selectedSize) return;

    addToCart({
      productId: selectedProduct.id,
      size: hasSizes ? selectedSize : '',
      price: selectedProduct.price,
      quantity: 1
    });
    setSelectedProduct(null);
    setSelectedSize('');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const openWhatsApp = (productName?: string) => {
    const text = productName 
      ? `Hello Krishani Fashion! I would like to inquire about: ${productName}`
      : `Hello Krishani Fashion! I have an inquiry about bed sheets and pillow cases.`;
    window.open(`https://wa.me/94760005364?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F6] overflow-hidden relative font-sans">
      {/* Brand Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 flex items-center justify-between border-b border-rose-100 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/krishani_fashion_logo.png" 
            alt="Krishani Fashion Logo" 
            onClick={handleSecretTap}
            className="w-14 h-14 rounded-full object-contain shadow-md shadow-pink-200/80 ring-2 ring-pink-200 cursor-pointer select-none shrink-0 transition-all bg-white"
          />
          <div>
            <h1 className="text-base font-serif font-bold text-[#292929] leading-tight flex items-center gap-1">
              {t('storeTitle')}
            </h1>
            <p className="text-[10px] font-bold text-[#D81B60] tracking-tight">{t('storeSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sliding Language Switcher Toggle */}
          <div 
            onClick={() => setLang(lang === 'si' ? 'en' : 'si')}
            className="relative flex items-center bg-rose-100/90 border border-rose-200/80 p-0.5 rounded-full cursor-pointer select-none w-[86px] h-[32px] transition-all shadow-inner hover:scale-105"
            title="Switch Language / භාෂාව වෙනස් කරන්න"
          >
            <div 
              className={`absolute top-0.5 bottom-0.5 w-[40px] bg-gradient-to-r from-[#c2185b] to-[#D81B60] rounded-full shadow-md transition-all duration-300 ease-out ${
                lang === 'en' ? 'left-0.5' : 'left-[43px]'
              }`}
            />
            <span className={`relative z-10 w-[40px] text-center text-[11px] font-black tracking-wider transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-gray-500'}`}>
              EN
            </span>
            <span className={`relative z-10 w-[40px] text-center text-[11px] font-black transition-colors duration-300 ${lang === 'si' ? 'text-white' : 'text-gray-500'}`}>
              සිං
            </span>
          </div>

          <button 
            onClick={() => openWhatsApp()} 
            className="w-8 h-8 rounded-full bg-emerald-50 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
            title="WhatsApp"
          >
            <WhatsAppIcon size={17} />
          </button>
          
          <button onClick={() => navigateTo('cart')} className="relative w-8 h-8 rounded-full bg-rose-50 text-[#D81B60] flex items-center justify-center hover:bg-[#D81B60] hover:text-white transition-all shadow-sm">
            <ShoppingBag size={17} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D81B60] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">
        {/* Luxury Landscape Brand Hero Banner */}
        <section className="px-5 pt-4 pb-4">
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#5a0026] via-[#a30040] via-[#d81b60] to-[#e91e63] text-white shadow-2xl shadow-rose-950/25 border border-rose-400/40 p-2 sm:p-3 overflow-hidden">
            {/* Silk Mesh & Gold Shimmer Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Soft Glowing Perfect Circles - Replacing cut-off blobs */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-1/4 -right-8 w-32 h-32 bg-amber-400/15 rounded-full blur-xl" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              
              {/* Subtle Linear Light Strokes */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white" />
            </div>

            <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 rounded-[2.2rem] bg-gradient-to-r from-black/20 via-transparent to-black/10 backdrop-blur-[1px] flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
              <div className="max-w-md text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.25em] text-amber-200 uppercase mb-2.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-sm">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" /> {t('heroTag')}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                  {t('heroTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/90 font-medium tracking-wide leading-relaxed mb-4 max-w-sm mx-auto sm:mx-0">
                  {t('heroDesc')}
                </p>

                {/* Delivery Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 border-t border-white/15 text-[11px] font-bold text-rose-100">
                  <span className="flex items-center gap-1.5 bg-black/25 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
                    <Truck size={14} className="text-amber-300" /> {t('islandwideDelivery')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/25 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
                    <ShieldCheck size={14} className="text-emerald-400" /> {t('cashOnDelivery')}
                  </span>
                </div>
              </div>

              {/* Prominent Unclipped Crisp Large Brand Logo Emblem */}
              <div className="flex flex-col items-center justify-center shrink-0 my-1 sm:my-0 sm:pr-2 md:pr-4 lg:pr-6">
                <div className="relative flex items-center justify-center p-2">
                  {/* Clean Background Glow Ring */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-amber-300 via-rose-300 to-pink-200 rounded-full blur-xl opacity-50 pointer-events-none" />
                  
                  {/* Ultra-Crisp Unclipped Sharp Logo Image - Perfect Circle */}
                  <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-white p-2 shadow-2xl ring-4 ring-amber-300/90 border-4 border-white transition-transform duration-300 hover:scale-105 select-none shrink-0 flex items-center justify-center">
                    <img 
                      src="/assets/krishani_fashion_logo.png" 
                      alt="Krishani Fashion Logo Emblem" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="px-5 mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
            <input 
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-rose-100 pl-11 pr-4 py-3.5 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#D81B60]/20 shadow-sm placeholder:text-gray-400 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        {/* Luxury Category Navigation Bar */}
        <section ref={categoryRef} className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <Layers size={14} className="text-[#D81B60]" />
              <span>{lang === 'si' ? 'වර්ගීකරණය අනුව තෝරන්න' : 'Explore Collections'}</span>
            </h3>
            <span className="text-[10px] font-bold text-[#D81B60] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              {categories.length} {lang === 'si' ? 'වර්ග' : 'Categories'}
            </span>
          </div>

          <div className="overflow-x-auto hide-scrollbar flex items-center gap-4 py-6 px-4 -my-3">
            {categories.map(cat => {
              const isSelected = activeCategory === cat;
              const formattedTitle = formatCategoryName(cat, lang);

              let IconComponent = Tag;
              let bgColor = 'bg-rose-50';
              let iconColor = 'text-rose-600';
              let activeGradient = 'from-rose-500 to-pink-600';

              if (cat === 'All' || cat === 'සියල්ල') {
                IconComponent = Sparkles;
                bgColor = 'bg-amber-50';
                iconColor = 'text-amber-600';
                activeGradient = 'from-amber-400 to-amber-600';
              } else if (cat.includes('Bed Sheets') || cat.includes('ඇඳ ඇතිරිලි')) {
                IconComponent = Layers;
                bgColor = 'bg-blue-50';
                iconColor = 'text-blue-600';
                activeGradient = 'from-blue-500 to-indigo-600';
              } else if (cat.includes('Pillow') || cat.includes('කොට්ට')) {
                IconComponent = Box;
                bgColor = 'bg-emerald-50';
                iconColor = 'text-emerald-600';
                activeGradient = 'from-emerald-500 to-teal-600';
              } else if (cat.includes('Duvet') || cat.includes('දුපොට්')) {
                IconComponent = Heart;
                bgColor = 'bg-pink-50';
                iconColor = 'text-pink-600';
                activeGradient = 'from-pink-500 to-rose-600';
              } else if (cat.includes('Mattress') || cat.includes('මැට්ට්‍රස්')) {
                IconComponent = ShieldCheck;
                bgColor = 'bg-purple-50';
                iconColor = 'text-purple-600';
                activeGradient = 'from-purple-500 to-fuchsia-600';
              }

              return (
                <div key={cat} className="flex flex-col items-center gap-2 shrink-0">
                  <WaterRippleButton
                    onClick={() => setActiveCategory(cat)}
                    className={`w-14 h-14 rounded-2xl transition-all duration-300 flex items-center justify-center select-none shadow-sm ${
                      isSelected
                        ? `bg-gradient-to-br ${activeGradient} text-white shadow-lg shadow-pink-200/80 scale-110 ring-2 ring-white`
                        : `${bgColor} ${iconColor} border border-white hover:scale-105`
                    }`}
                  >
                    <IconComponent size={24} className={isSelected ? 'text-white' : ''} />
                  </WaterRippleButton>
                  <span className={`text-[10px] font-black uppercase tracking-tight transition-colors duration-300 ${isSelected ? 'text-[#D81B60]' : 'text-gray-500'}`}>
                    {formattedTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedProduct(product)}
                className={`bg-white rounded-[1.8rem] overflow-hidden shadow-sm hover:shadow-md border border-rose-100/80 flex flex-col group cursor-pointer transition-all ${
                  product.inStock === false ? 'opacity-80' : ''
                }`}
              >
                <div className="relative aspect-[4/4] overflow-hidden bg-rose-50">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        product.inStock === false ? 'grayscale-[20%]' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300">
                      <ShoppingBag size={36} />
                    </div>
                  )}

                  {product.inStock === false && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {t('outOfStock')}
                    </span>
                  )}

                  <button
                    onClick={(e) => toggleLike(e, product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#D81B60] shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart size={16} className={liked[product.id] ? 'fill-[#D81B60]' : ''} />
                  </button>
                  {product.category && (
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-black bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {formatCategoryName(product.category, lang)}
                    </span>
                  )}
                </div>
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#292929] mb-1 leading-snug line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-[#D81B60]">Rs. {product.price.toLocaleString()}</p>
                    </div>
                    <button className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      product.inStock === false ? 'bg-gray-100 text-gray-400' : 'bg-rose-50 text-[#D81B60] group-hover:bg-[#D81B60] group-hover:text-white'
                    }`}>
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-4 shadow-inner">
              <Search size={30} />
            </div>
            <h3 className="text-base font-bold text-[#292929] mb-1">{t('noProductsFound')}</h3>
            <p className="text-xs text-gray-500 max-w-xs">{t('tryAdjustingSearch')}</p>
          </div>
        )}

        {/* End of content spacing */}
        <div className="h-12" />
      </div>

      <IOSGuideModal show={showIOSGuide} onClose={() => setShowIOSGuide(false)} t={t} />

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-md hover:bg-[#D81B60] hover:text-white transition-all"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto bg-rose-50 relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col">
                <div className="mb-5">
                  {selectedProduct.inStock === false ? (
                    <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      ● {t('outOfStock')}
                    </span>
                  ) : (
                    <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      ● {t('inStock')}
                    </span>
                  )}
                  <span className="text-[10px] font-black tracking-widest text-[#D81B60] uppercase mb-1 block">
                    {formatCategoryName(selectedProduct.category, lang)}
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#292929] mb-2 leading-snug">{selectedProduct.name}</h2>
                  <p className="text-2xl font-black text-[#D81B60]">Rs. {selectedProduct.price.toLocaleString()}</p>
                </div>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-wider mb-3">{t('selectSize')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            selectedSize === size
                              ? 'bg-[#D81B60] text-white shadow-md shadow-rose-200'
                              : 'bg-rose-50/60 text-gray-700 border border-rose-100 hover:border-rose-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-auto">
                  <WaterRippleButton
                    disabled={selectedProduct.inStock === false || Boolean(selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize)}
                    onClick={handleAddToCart}
                    className="w-full bg-[#D81B60] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {selectedProduct.inStock === false 
                      ? t('outOfStockBtn') 
                      : selectedSize ? `${t('addToCart')} (${selectedSize})` : t('addToCart')}
                  </WaterRippleButton>

                  <WaterRippleButton
                    onClick={() => openWhatsApp(selectedProduct.name)}
                    className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-200 hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon size={16} /> {t('whatsAppOrder')}
                  </WaterRippleButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

