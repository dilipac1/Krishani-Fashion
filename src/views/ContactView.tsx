import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, Smartphone, X, Sparkles, MapPin, Instagram, Facebook } from 'lucide-react';
import { WaterRippleButton } from '../components/WaterRippleButton';
import { usePWAInstall } from '../hooks/usePWAInstall';

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.046c0 2.121.54 4.192 1.566 6.04L0 24l6.117-1.604a11.803 11.803 0 005.925 1.585h.005c6.637 0 12.048-5.414 12.051-12.049a11.824 11.824 0 00-3.517-8.417z" />
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

export const ContactView: React.FC = () => {
  const { lang, t } = useStore();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const openWhatsApp = () => {
    const text = `Hello Krishani Fashion! I have an inquiry about bed sheets and pillow cases.`;
    window.open(`https://wa.me/94760005364?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAndroidInstall = async () => {
    if (isInstalled) {
      alert(lang === 'si' ? 'App එක දැනටමත් install කර ඇත.' : 'App is already installed.');
      return;
    }
    if (isInstallable) {
      const success = await install();
      if (!success) {
        // User cancelled or error
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt or it hasn't fired yet
      alert(lang === 'si' 
        ? 'ඔබේ Browser එකෙන් සෘජු ස්ථාපනයට සහය නොදක්වයි. කරුණාකර Chrome හෝ Edge භාවිතා කරන්න, නැතහොයි Browser එකේ "Add to Home Screen" විකල්පය භාවිතා කරන්න.' 
        : 'Direct installation is not supported by this browser. Please use Chrome or Edge, or use the "Add to Home Screen" option in your browser menu.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFF9F6] hide-scrollbar pb-32">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-6 border-b border-rose-100 sticky top-0 z-20">
        <h2 className="text-2xl font-serif font-bold text-[#292929]">
          {lang === 'si' ? 'අප හා සම්බන්ධ වන්න' : 'Contact Us'}
        </h2>
        <p className="text-xs font-bold text-[#D81B60] mt-1 uppercase tracking-widest">
          {lang === 'si' ? 'අපි සැමවිටම ඔබ වෙනුවෙන් සූදානම්' : 'We are always here for you'}
        </p>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Main Brand Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-rose-100 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-50 rounded-full blur-2xl" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-[1.8rem] shadow-xl shadow-pink-100 border border-rose-50 p-3 mb-4 relative z-10">
              <img 
                src="/assets/krishani_fashion_logo.png" 
                alt="Krishani Fashion Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-serif font-black text-[#292929]">{t('storeTitle')}</h3>
            <p className="text-xs font-bold text-[#D81B60] mt-1">{t('storeSubtitle')}</p>
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-rose-100 to-transparent my-6" />
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <WaterRippleButton 
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 hover:bg-[#128C7E] transition-all"
              >
                <WhatsAppIcon size={20} />
                <span>{t('whatsAppOrder')}</span>
              </WaterRippleButton>

              <a 
                href="tel:0760005364" 
                className="w-full bg-white text-gray-800 border border-rose-100 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-rose-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#D81B60]">
                  <Phone size={18} />
                </div>
                <span>{t('directCall')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Location & Socials */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-[2rem] p-6 border border-rose-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'si' ? 'ස්ථානය' : 'Location'}</p>
              <p className="text-sm font-bold text-gray-800">Krishani Fashion, Dimbulgamuwa, Rambukkana</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a 
              href="https://www.facebook.com/profile.php?id=61556530113597" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white rounded-[2rem] p-6 border border-rose-100 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Facebook size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook</p>
                <p className="text-sm font-bold text-gray-800">Krishani Fashion</p>
              </div>
            </a>
          </div>
        </div>

        {/* App Download Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <h4 className="text-lg font-serif font-bold">{lang === 'si' ? 'අපේ App එක ලබාගන්න' : 'Get Our App'}</h4>
            </div>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              {lang === 'si' 
                ? 'වඩාත් පහසුවෙන් සහ ඉක්මනින් ඇණවුම් කිරීමට අපගේ නිල App එක භාවිතා කරන්න.' 
                : 'Experience seamless shopping and faster orders with our official mobile app.'}
            </p>
            
            <div className="flex flex-col gap-3">
              <WaterRippleButton 
                onClick={() => {
                  if (isInstalled) alert(lang === 'si' ? 'App එක දැනටමත් install කර ඇත.' : 'App is already installed.');
                  else setShowIOSGuide(true);
                }}
                className="w-full bg-white text-black py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-100 transition-all"
              >
                <AppleIcon size={18} />
                <span>iOS App</span>
              </WaterRippleButton>
              <WaterRippleButton 
                onClick={handleAndroidInstall}
                className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                <PlayStoreIcon size={18} />
                <span>Android App</span>
              </WaterRippleButton>
            </div>
          </div>
        </div>
      </div>

      <IOSGuideModal show={showIOSGuide} onClose={() => setShowIOSGuide(false)} t={t} />
    </div>
  );
};
