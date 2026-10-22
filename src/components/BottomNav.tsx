import React from 'react';
import { Home, Package, TrendingUp, ShoppingBag, LayoutGrid, Heart, LayoutDashboard, ShoppingCart, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../store';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  mode: 'shop' | 'admin';
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, mode }) => {
  const { cart, t, lang } = useStore();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const shopTabs = [
    { id: 'shop', label: t('home'), icon: Home, count: 0 },
    { id: 'categories', label: t('categories'), icon: LayoutGrid, count: 0 },
    { id: 'wishlist', label: t('wishlist'), icon: Heart, count: 0 },
    { id: 'cart', label: t('cart'), icon: ShoppingCart, count: cartItemsCount },
    { id: 'contact', label: t('contactUs'), icon: MessageCircle, count: 0 },
  ];

  const adminTabs = [
    { id: 'dashboard', label: t('home'), icon: LayoutDashboard, count: 0 },
    { id: 'orders', label: t('orders'), icon: ShoppingBag, count: 0 },
    { id: 'inventory', label: t('stock'), icon: Package, count: 0 },
    { id: 'reports', label: t('reports'), icon: TrendingUp, count: 0 },
  ];

  const tabs = mode === 'shop' ? shopTabs : adminTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-8 pt-2">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(236,72,153,0.12)] rounded-[2.5rem] flex justify-around items-center h-18 px-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                className={`transition-colors duration-300 ${
                  isActive ? 'text-[#D81B60]' : 'text-[#777777] group-hover:text-pink-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D81B60] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm">
                    {tab.count}
                  </span>
                )}
              </motion.div>
              <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${
                isActive ? 'text-[#D81B60] opacity-100 scale-100' : 'text-[#777777] opacity-0 scale-90'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-[#D81B60] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
