import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, X, Heart, MessageCircle, Phone, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2, Layers, Box, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCategoryName } from '../lib/translations';
import { WaterRippleButton } from '../components/WaterRippleButton';

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
            className="w-14 h-14 rounded-full object-cover shadow-md shadow-pink-200/80 ring-2 ring-pink-200 cursor-pointer select-none shrink-0 hover:scale-105 transition-all bg-white"
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
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            title="WhatsApp"
          >
            <MessageCircle size={17} />
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
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#5a0026] via-[#a30040] via-[#d81b60] to-[#e91e63] text-white shadow-2xl shadow-rose-950/25 border border-rose-400/40 p-2 sm:p-3">
            {/* Silk Mesh & Gold Shimmer Background Layers */}
            <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none overflow-hidden">
              {/* Radial Golden Highlight */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl mix-blend-screen" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
              
              {/* Organic Floral Silk Vectors matching logo art */}
              <svg className="absolute -top-10 -right-10 w-80 h-80 opacity-20 text-rose-100" fill="currentColor" viewBox="0 0 200 200">
                <path d="M44.7,-61.2C56.2,-52.3,62.8,-36.8,66.1,-21C69.4,-5.2,69.4,10.9,63.1,24.8C56.8,38.7,44.2,50.3,29.9,57.7C15.6,65.1,-0.4,68.2,-16.7,65.6C-33,63,-49.6,54.7,-60.1,41.4C-70.6,28.1,-75,9.8,-72.7,-7.1C-70.4,-24,-61.4,-39.5,-48.9,-48.8C-36.4,-58.1,-20.4,-61.1,-3.5,-56.3C13.4,-51.5,33.2,-70.1,44.7,-61.2Z" transform="translate(100 100)" />
              </svg>
              <svg className="absolute -bottom-16 -left-12 w-96 h-96 opacity-15 text-pink-200" fill="currentColor" viewBox="0 0 200 200">
                <path d="M41.5,-58.1C52.4,-50.2,59.3,-36.4,63.1,-21.8C66.9,-7.2,67.6,8.2,62.4,22.1C57.2,36,46.1,48.4,32.7,56.5C19.3,64.6,3.6,68.4,-12.3,66.5C-28.2,64.6,-44.3,57,-55.1,44.5C-65.9,32,-71.4,14.6,-70.2,-2.1C-69,-18.8,-61.1,-34.8,-49.4,-43.3C-37.7,-51.8,-22.2,-52.8,-6.9,-43.3C8.4,-33.8,30.6,-66,41.5,-58.1Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 rounded-[2.2rem] bg-gradient-to-r from-black/30 via-transparent to-black/15 backdrop-blur-[1px] flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
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
                  <div className="absolute -inset-1 bg-gradient-to-tr from-amber-300 via-rose-300 to-pink-200 rounded-full blur-md opacity-60 pointer-events-none" />
                  
                  {/* Ultra-Crisp Unclipped Sharp Logo Image */}
                  <img 
                    src="/assets/krishani_fashion_logo.png" 
                    alt="Krishani Fashion Logo Emblem" 
                    className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-contain bg-white p-2 shadow-2xl ring-4 ring-amber-300/90 border-4 border-white transition-transform duration-300 hover:scale-105 select-none shrink-0"
                  />
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

          <div className="overflow-x-auto hide-scrollbar flex items-center gap-3 py-4 px-2 -my-2">
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
            <img 
              src="/assets/krishani_fashion_logo.png" 
              alt="Krishani Fashion Logo" 
              className="w-24 h-24 rounded-2xl object-contain shadow-md bg-white p-1.5 border border-rose-200 mb-3"
            />
            <h4 className="font-serif font-bold text-[#292929] text-lg">{t('storeTitle')}</h4>
            <p className="text-xs text-[#D81B60] font-bold mt-0.5">{t('storeSubtitle')}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">
              📍 {lang === 'si' ? 'දිඹුල්ගමුව, රඹුක්කන, ශ්‍රී ලංකාව' : 'Dimbulgamuwa, Rambukkana, Sri Lanka'}
            </p>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => openWhatsApp()} 
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all"
              >
                <MessageCircle size={15} /> {t('whatsAppOrder')}
              </button>
              <a 
                href="tel:0760005364" 
                className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-all"
              >
                <Phone size={15} className="text-[#D81B60]" /> {t('directCall')} (+94 76 000 5364)
              </a>
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
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> {t('whatsAppOrder')}
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

