import React, { useState } from 'react';
import { useStore } from '../store';
import { ShoppingBag, ChevronDown, Package, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';
import { OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const OrdersView = () => {
  const { orders, updateOrderStatus, products } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const matchesSearch = o.customerDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const statusConfig: Record<OrderStatus, { color: string, bg: string, icon: any }> = {
    'Pending': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    'Processing': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
    'Shipped': { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck },
    'Delivered': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
    'Cancelled': { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle },
  };

  const statuses: (OrderStatus | 'All')[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30 hide-scrollbar pb-24">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 shadow-sm z-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#292929]">Orders</h2>
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#F72578]">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#F72578]/10 transition-all"
          />
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === s 
                  ? 'bg-[#F72578] text-white shadow-lg shadow-pink-100' 
                  : 'bg-gray-50 text-[#777777] border border-gray-100 hover:border-pink-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4">
                <ShoppingBag size={32} />
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No orders found</p>
            </motion.div>
          ) : (
            filteredOrders.map((order, idx) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={order.id} 
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-pink-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">#{order.id.slice(-6)}</span>
                        <div className={`px-3 py-1 rounded-full ${config.bg} ${config.color} flex items-center gap-1.5`}>
                          <StatusIcon size={10} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-[#292929]">{order.customerDetails?.name || 'Guest Customer'}</h4>
                      <p className="text-[10px] text-[#777777] font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                    </div>
                    <div className="relative group">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="appearance-none bg-gray-50 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer pr-10 border border-gray-100 focus:border-pink-200"
                      >
                        {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300" />
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-4 mb-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={idx} className="flex justify-between items-center text-[10px] font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-10 rounded-lg bg-pink-100 overflow-hidden">
                                {product?.image && <img src={product.image} className="w-full h-full object-cover" />}
                              </div>
                              <span className="text-[#292929]">{item.quantity}x {product?.name || 'Product'} {item.size ? `(${item.size})` : ''}</span>
                            </div>
                            <span className="text-[#777777]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-black text-[#777777] uppercase tracking-widest">Total Amount</span>
                    <span className="text-base font-black text-[#F72578]">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
