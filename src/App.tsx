/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './store';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { InventoryView } from './views/InventoryView';
import { ReportsView } from './views/ReportsView';
import { ShopView } from './views/ShopView';
import { CartView } from './views/CartView';
import { WishlistView } from './views/WishlistView';
import { ContactView } from './views/ContactView';
import { Settings, LogOut, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WaterRippleButton } from './components/WaterRippleButton';

function AppContent() {
  const { lang } = useStore();
  const [mode, setMode] = useState<'shop' | 'admin'>('shop');
  const [activeTab, setActiveTab] = useState('shop');
  
  // Login Modal State
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { // Default password for demo
      setMode('admin');
      setActiveTab('dashboard');
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const renderView = () => {
    if (mode === 'shop') {
      switch (activeTab) {
        case 'shop': return <ShopView navigateTo={setActiveTab} onAdminTrigger={() => setShowLogin(true)} activeTab={activeTab} />;
        case 'categories': return <ShopView navigateTo={setActiveTab} onAdminTrigger={() => setShowLogin(true)} activeTab={activeTab} />;
        case 'wishlist': return <WishlistView navigateTo={setActiveTab} />;
        case 'cart': return <CartView navigateTo={setActiveTab} />;
        case 'contact': return <ContactView />;
        default: return <ShopView navigateTo={setActiveTab} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <DashboardView navigateTo={setActiveTab} />;
        case 'orders': return <OrdersView />;
        case 'inventory': return <InventoryView />;
        case 'reports': return <ReportsView />;
        default: return <DashboardView navigateTo={setActiveTab} />;
      }
    }
  };

  return (
    <div className="bg-[#FFF9F6] min-h-[100dvh] flex justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-5xl h-[100dvh] bg-white flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,0.03)] border-x border-pink-50/30">
        <ToastContainer />
        
        {/* Main View Rendering */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Admin Logout Button - Centered above BottomNav for better balance */}
        {mode === 'admin' && (
          <div className="fixed bottom-28 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <WaterRippleButton 
              onClick={() => {
                setMode('shop');
                setActiveTab('shop');
              }}
              className="pointer-events-auto flex items-center gap-2.5 bg-white/90 backdrop-blur-md shadow-xl shadow-rose-900/5 px-6 py-3 rounded-full text-rose-600 hover:bg-[#D81B60] hover:text-white border border-rose-100 transition-all group font-black text-[10px] uppercase tracking-widest"
              title="Logout from Admin"
            >
              <LogOut size={16} className="group-hover:scale-110 transition-transform" />
              <span>{lang === 'si' ? 'පාලක පැනලයෙන් ඉවත් වන්න' : 'Logout from Admin'}</span>
            </WaterRippleButton>
          </div>
        )}

        {/* Login Modal */}
        <AnimatePresence>
          {showLogin && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogin(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-400"></div>
                
                <button 
                  onClick={() => { setShowLogin(false); setPassword(''); setError(''); }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-pink-50 p-5 rounded-[1.5rem] text-[#D81B60] shadow-inner shadow-pink-100">
                    <Lock size={32} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-serif text-[#292929] font-bold text-center mb-1">Admin Access</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#777777] text-center mb-10">Verification Required</p>
                
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="space-y-2">
                    <input 
                      type="password" 
                      placeholder="Access Token"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-center tracking-[0.5em] text-lg font-bold placeholder:tracking-normal placeholder:text-xs placeholder:font-medium transition-all"
                      autoFocus
                    />
                    {error && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest mt-2">{error}</p>}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-[#D81B60] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl shadow-xl shadow-pink-100 hover:translate-y-[-2px] active:translate-y-0 transition-all"
                  >
                    Authenticate
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <BottomNav currentTab={activeTab} onChangeTab={setActiveTab} mode={mode} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
