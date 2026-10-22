import React, { useState } from 'react';
import { useStore } from '../store';
import { ChevronLeft, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WaterRippleButton } from '../components/WaterRippleButton';

export const CartView = ({ navigateTo }: { navigateTo: (tab: string) => void }) => {
  const { cart, products, removeFromCart, addOrder, addCustomer, clearCart, t } = useStore();
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill in your delivery details.");
      return;
    }

    addCustomer(customerInfo);
    
    addOrder({
      customerDetails: customerInfo,
      items: cart,
      total: cartTotal,
      status: 'Pending'
    });

    const storePhone = "94760005364";
    let waMessage = `*New Order - Krishani Fashion (ක්‍රිෂාණි ෆැෂන්)*\n\n`;
    waMessage += `*Customer Details:*\nName: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nAddress: ${customerInfo.address}\n\n`;
    waMessage += `*Order Items:*\n`;
    
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const itemName = product ? product.name : 'Unknown Item';
      const sizeStr = item.size ? ` (${item.size})` : '';
      waMessage += `- ${itemName}${sizeStr} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    waMessage += `\n*Total Amount: Rs. ${cartTotal.toLocaleString()}*`;
    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');

    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FFF9F6] h-full text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }} 
          animate={{ scale: 1, rotate: 0 }} 
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-100 border-4 border-white"
        >
          <CheckCircle2 size={56} />
        </motion.div>
        <h2 className="text-3xl font-serif font-bold text-[#292929] mb-4">{t('orderConfirmed')}</h2>
        <p className="text-[#777777] mb-12 max-w-xs leading-relaxed font-medium">{t('orderThankYou')}</p>
        <WaterRippleButton 
          onClick={() => navigateTo('shop')}
          className="px-10 py-4 bg-[#D81B60] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-rose-200 transition-transform hover:scale-105 active:scale-95"
        >
          {t('backToStore')}
        </WaterRippleButton>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F6] h-full relative overflow-hidden">
      <header className="px-6 pt-12 pb-6 bg-white flex items-center gap-4 border-b border-rose-100 sticky top-0 z-20">
        <button onClick={() => navigateTo('shop')} className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#D81B60] hover:bg-rose-100 transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-[#292929]">{t('shoppingBag')}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-40 hide-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-6">
              <CheckCircle2 size={40} className="opacity-20" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#292929] mb-2">{t('emptyBag')}</h3>
            <p className="text-xs text-[#777777] mb-8 font-medium">{t('emptyBagDesc')}</p>
            <button 
              onClick={() => navigateTo('shop')} 
              className="text-[#D81B60] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all"
            >
              {t('shopCollection')} <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-[#D81B60] uppercase tracking-[0.2em] mb-2">{t('itemsInBag')} ({cart.length})</h3>
              <AnimatePresence>
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      key={`${item.productId}-${item.size}`} 
                      className="flex bg-white p-4 rounded-3xl shadow-sm border border-rose-100 items-center gap-4 group"
                    >
                      <div className="w-20 h-24 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#292929] line-clamp-1 mb-1 uppercase tracking-tight">{product.name}</h4>
                        <p className="text-[10px] text-[#777777] font-medium mb-2">{item.size ? `Size: ${item.size} · ` : ''}Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-[#D81B60]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size || '')}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-[#D81B60] uppercase tracking-[0.2em] mb-2">{t('deliveryDetails')}</h3>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-rose-100 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1">{t('fullName')}</label>
                  <input 
                    type="text" placeholder="Hii Alina!" 
                    value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-xs font-medium placeholder-gray-300 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1">{t('phoneNumber')}</label>
                  <input 
                    type="tel" placeholder="+94 76 000 5364" 
                    value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-xs font-medium placeholder-gray-300 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1">{t('address')}</label>
                  <textarea 
                    placeholder="Where should we send your package?" rows={3}
                    value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-xs font-medium placeholder-gray-300 transition-all resize-none"
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-8 pt-6 border-t border-rose-100 flex flex-col gap-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(236,72,153,0.08)]">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#777777] uppercase tracking-widest">{t('totalPay')}</span>
              <span className="text-2xl font-black text-[#D81B60]">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <WaterRippleButton 
              onClick={handlePlaceOrder}
              className="px-10 py-4 bg-[#D81B60] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-rose-200 transition-transform hover:scale-105 active:scale-95"
            >
              {t('placeOrder')}
            </WaterRippleButton>
          </div>
        </div>
      )}
    </div>
  );
};
