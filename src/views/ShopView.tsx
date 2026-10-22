import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, X, Heart, MessageCircle, Phone, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2, Layers, Box, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCategoryName } from '../lib/translations';
import { WaterRippleButton } from '../components/WaterRippleButton';

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.73.443 3.403 1.284 4.874L2 22l5.252-1.378c1.41.764 2.997 1.169 4.76 1.169 5.532 0 10.012-4.48 10.012-10.012 0-2.67-1.04-5.18-2.93-7.07-1.89-1.89-4.4-2.93-7.07-2.93zm0 1.5c2.27 0 4.4 0.884 6.007 2.493 1.607 1.608 2.493 3.738 2.493 6.019 0 4.703-3.829 8.532-8.5 8.532-1.63 0-3.175-0.457-4.507-1.317l-0.324-0.192-3.111 0.816 0.83-3.031-0.211-0.334A8.47 8.47 0 013.5 12.012c0-4.703 3.828-8.512 8.512-8.512zm-3.568 3.52c-0.195 0-0.374 0.038-0.536 0.114-0.162 0.076-0.312 0.19-0.449 0.342-0.274 0.304-0.441 0.695-0.501 1.173-0.06 0.478 0.06 1.01 0.36 1.596 0.3 0.586 0.771 1.144 1.413 1.674 1.284 1.06 2.748 1.83 4.391 2.31 0.413 0.12 0.784 0.18 1.113 0.18 0.413 0 0.754-0.093 1.023-0.278 0.269-0.185 0.485-0.458 0.648-0.818 0.163-0.36 0.244-0.785 0.244-1.274 0-0.095-0.007-0.186-0.021-0.274-0.014-0.088-0.035-0.174-0.063-0.258a0.84 0.84 0 00-0.311-0.441c-0.138-0.106-0.326-0.186-0.564-0.24l-1.357-0.322c-0.238-0.054-0.445-0.03-0.62 0.072-0.175 0.102-0.323 0.27-0.443 0.505l-0.413 0.816c-0.084 0.166-0.218 0.264-0.402 0.294a0.7 0.7 0 01-0.428-0.114c-0.163-0.106-0.373-0.263-0.63-0.472-0.257-0.209-0.548-0.468-0.874-0.777-0.326-0.309-0.655-0.655-0.987-1.038-0.332-0.383-0.613-0.75-0.843-1.101a0.76 0.76 0 01-0.114-0.462 0.66 0.66 0 010.228-0.417l0.672-0.756c0.156-0.174 0.244-0.355 0.264-0.543a0.65 0.65 0 00-0.132-0.495L9.626 7.31c-0.126-0.174-0.276-0.31-0.449-0.408a0.85 0.85 0 00-0.354-0.122c-0.125-0.014-0.252-0.02-0.379-0.02z" />
  </svg>
);

export const ShopView = ({ navigateTo, onAdminTrigger, activeTab }: { navigateTo: (tab: string) => void, onAdminTrigger?: () => void, activeTab?: string }) => {
  const { products, cart, addToCart, lang, setLang, t, availableCategories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
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

          <div className="overflow-x-auto hide-scrollbar flex items-center gap-3 py-6 px-4 -my-3">
            {categories.map(cat => {
              const isSelected = activeCategory === cat;
              const formattedTitle = formatCategoryName(cat, lang);

              let IconComponent = Tag;
              if (cat === 'All' || cat === 'සියල්ල') IconComponent = Sparkles;
              else if (cat.includes('Bed Sheets') || cat.includes('ඇඳ ඇතිරිලි')) IconComponent = Layers;
              else if (cat.includes('Pillow') || cat.includes('කොට්ට')) IconComponent = Box;
              else if (cat.includes('Duvet') || cat.includes('දුපොට්')) IconComponent = Heart;
              else if (cat.includes('Mattress') || cat.includes('මැට්ට්‍රස්')) IconComponent = ShieldCheck;

              return (
                <WaterRippleButton
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 select-none shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#c2185b] to-[#D81B60] text-white shadow-lg shadow-rose-200/80 scale-105 ring-2 ring-rose-200'
                      : 'bg-white text-gray-700 border border-rose-100/80 hover:border-rose-300 hover:bg-rose-50/40 shadow-sm'
                  }`}
                >
                  <IconComponent size={15} className={isSelected ? 'text-amber-300' : 'text-[#D81B60] opacity-80'} />
                  <span>{formattedTitle}</span>
                  {isSelected && (
                    <motion.span 
                      layoutId="activeCategoryDot" 
                      className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" 
                    />
                  )}
                </WaterRippleButton>
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

        {/* Store Location & Direct Contact Footer Banner */}
        <section className="px-5 mt-8 mb-4">
          <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-pink-100/70 rounded-3xl p-6 border border-rose-200/80 text-center flex flex-col items-center shadow-sm">
            <div className="relative w-24 h-24 mb-3">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-md p-1.5 border border-rose-200 overflow-hidden flex items-center justify-center">
                <img 
                  src="/assets/krishani_fashion_logo.png" 
                  alt="Krishani Fashion Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h4 className="font-serif font-bold text-[#292929] text-lg">{t('storeTitle')}</h4>
            <p className="text-xs text-[#D81B60] font-bold mt-0.5">{t('storeSubtitle')}</p>
            <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
              <div className="flex gap-3">
                <WaterRippleButton 
                  onClick={() => openWhatsApp()} 
                  className="flex-1 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-200 hover:bg-[#128C7E] transition-all"
                >
                  <WhatsAppIcon size={16} /> {t('whatsAppOrder')}
                </WaterRippleButton>
                <a 
                  href="tel:0760005364" 
                  className="flex-1 bg-white text-gray-800 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Phone size={15} className="text-[#D81B60]" /> {t('directCall')}
                </a>
              </div>
              
              <div className="pt-4 border-t border-rose-200/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{lang === 'si' ? 'අපේ App එක ලබාගන්න' : 'Download Our Official App'}</p>
                <div className="flex justify-center gap-3">
                  <WaterRippleButton className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-800 transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.5 12c0-2.5 1.5-4.5 3.5-5.5-1-1.5-2.5-2.5-4.5-2.5-2 0-3 1-4.5 1-1 0-2.5-1-4-1-3 0-6 2.5-6 7 0 2.5 1 5 2.5 7.5s2.5 4.5 4.5 4.5c1 0 1.5-0.5 3-0.5s2 0.5 3 0.5c1.5 0 3-2 4-4.5-0.5-0.5-1.5-1-1.5-3zM14.5 1.5c1-1.5 0.5-3.5 0.5-3.5-2 0-3.5 1.5-3.5 3.5 0 0.5 0 1 0.5 1.5 0.5 0 1.5 0.5 2.5-1.5z"/></svg>
                    <span>iOS App</span>
                  </WaterRippleButton>
                  <WaterRippleButton className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-800 transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.523 15.341l3.038-1.754a.83.83 0 000-1.437l-3.038-1.754-.954 1.652.954 1.653-.001.04zm-1.897 1.096l-1.39-2.407-1.39 2.407a.83.83 0 00.718 1.243h1.344a.83.83 0 00.718-1.243zm-4.226-2.407l-3.038 1.754-.001.04a.83.83 0 00.718 1.243h1.344a.83.83 0 00.718-1.243l-1.39-2.407-.001.041zm-1.648-1.653l3.038-1.754-.954-1.653-.954 1.653h-.001.04zm1.897-1.096l1.39 2.407 1.39-2.407a.83.83 0 00-.718-1.243h-1.344a.83.83 0 00-.718 1.243zM3.439 2.656l14.887 8.595a.831.831 0 010 1.437L3.439 21.284a.831.831 0 01-1.243-.718V3.374a.831.831 0 011.243-.718z"/></svg>
                    <span>Android App</span>
                  </WaterRippleButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

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

