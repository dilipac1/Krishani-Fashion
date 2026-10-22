import React from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export const WishlistView = ({ navigateTo }: { navigateTo: (tab: string) => void }) => {
  // Since the store doesn't have a wishlist yet, we'll use a local mock or a simple implementation.
  // Ideally, the store should handle this. For now, we'll show an empty state or instructions.
  
  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F6] h-full relative overflow-hidden">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-pink-50 sticky top-0 z-20">
        <h1 className="text-2xl font-serif font-bold text-[#292929]">Wishlist</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-300 mb-6">
          <Heart size={40} className="opacity-20" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#292929] mb-2">Your wishlist is empty</h3>
        <p className="text-xs text-[#777777] mb-8 font-medium leading-relaxed max-w-xs">Save your favourite outfits here to find them easily later!</p>
        <button 
          onClick={() => navigateTo('shop')} 
          className="text-[#F72578] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all"
        >
          Explore Collection <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
