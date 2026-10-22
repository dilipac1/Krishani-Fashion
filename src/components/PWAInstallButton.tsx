import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { WaterRippleButton } from './WaterRippleButton';
import { Download, Apple, Smartphone, X, Info } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC<{ variant?: 'hero' | 'footer' }> = ({ variant = 'footer' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t, lang } = useStore();

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else if (isInstallable) {
      install();
    } else {
      setShowIOSGuide(true); 
    }
  };

  if (variant === 'hero') {
    return (
      <>
        <WaterRippleButton
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-white/30 transition-all shadow-lg"
        >
          <Download size={16} className="text-amber-300" />
          <span>{t('installApp')}</span>
        </WaterRippleButton>

        <IOSGuideModal show={showIOSGuide} onClose={() => setShowIOSGuide(false)} t={t} />
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-gradient-to-br from-rose-50 to-pink-100 rounded-[2rem] p-6 border border-rose-200/60 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-[#D81B60]/5 rounded-full blur-2xl group-hover:bg-[#D81B60]/10 transition-colors" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D81B60] shadow-sm mb-3 ring-4 ring-[#D81B60]/5">
            <Smartphone size={24} />
          </div>
          <h3 className="text-sm font-black text-[#292929] mb-1">
            {t('getTheApp')}
          </h3>
          <p className="text-[10px] font-bold text-gray-500 mb-5 max-w-[200px]">
            {t('appDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <WaterRippleButton
              onClick={handleInstallClick}
              className="flex-1 bg-[#D81B60] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>{t('installApp')}</span>
            </WaterRippleButton>
            
            <div className="flex items-center justify-center gap-4 py-1 text-gray-400">
              <div className="flex items-center gap-1">
                <Smartphone size={14} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">Android</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center gap-1">
                <Apple size={14} className="text-gray-600" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">iOS / iPhone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <IOSGuideModal show={showIOSGuide} onClose={() => setShowIOSGuide(false)} t={t} />
    </>
  );
};

const IOSGuideModal: React.FC<{ show: boolean; onClose: () => void; t: any }> = ({ show, onClose, t }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
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

            <h3 className="text-lg font-serif font-black text-[#292929] mb-4">
              {t('howToInstall')}
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs">1</div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    {t('step1')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-black text-xs">2</div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    {t('step2')}
                  </p>
                  <div className="mt-2 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-blue-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-black text-xs">3</div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    {t('step3')}
                  </p>
                  <div className="mt-2 border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 bg-gray-50">
                    <div className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-400">+</div>
                    <span className="text-[10px] font-black text-gray-600 uppercase">Add to Home Screen</span>
                  </div>
                </div>
              </div>
            </div>

            <WaterRippleButton
              onClick={onClose}
              className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              {t('gotIt')}
            </WaterRippleButton>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
