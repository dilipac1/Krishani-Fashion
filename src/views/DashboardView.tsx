import React from 'react';
import { useStore } from '../store';
import { Package, TrendingUp, Clock, ChevronRight, Activity, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView = ({ navigateTo }: { navigateTo: (tab: string) => void }) => {
  const { orders, notifications, customers } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => (o.createdAt || '').startsWith(today));
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Today Sales', value: `Rs. ${todaySales.toLocaleString()}`, sub: `${todayOrders.length} orders`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Orders', value: pendingOrders, sub: 'Needs action', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: `Rs. ${(totalRevenue / 1000).toFixed(1)}k`, sub: 'All time', icon: TrendingUp, color: 'text-[#F72578]', bg: 'bg-pink-50' },
    { label: 'Total Customers', value: customers.length, sub: 'Loyal users', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/30 hide-scrollbar pb-24">
      <header className="px-6 pt-12 pb-8 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-serif font-bold text-[#292929]">Dashboard</h1>
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#F72578]">
            <Activity size={20} />
          </div>
        </div>
        <p className="text-sm text-[#777777] font-medium">Welcome back, Admin ✨</p>
      </header>

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm"
            >
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-black text-[#777777] uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-lg font-black text-[#292929] leading-tight mb-1">{stat.value}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-[10px] font-black text-[#F72578] uppercase tracking-[0.2em] mb-4 ml-1">Quick Management</h2>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => navigateTo('orders')}
              className="group flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-pink-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-50 text-[#F72578] p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <ShoppingCart size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#292929]">Manage Orders</span>
                  <span className="text-[10px] text-[#777777] font-medium">{pendingOrders} orders waiting</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#F72578] transition-colors" />
            </button>
            
            <button 
              onClick={() => navigateTo('inventory')}
              className="group flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-pink-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#292929]">Stock Inventory</span>
                  <span className="text-[10px] text-[#777777] font-medium">Update products & prices</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#F72578] transition-colors" />
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-black text-[#F72578] uppercase tracking-[0.2em]">Recent Activity</h2>
            <button className="text-[10px] font-bold text-gray-400 hover:text-[#F72578] transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notif, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                key={notif.id} 
                className={`p-5 rounded-3xl border ${notif.read ? 'bg-white/50 border-gray-100' : 'bg-white border-pink-100 shadow-sm'} flex flex-col gap-1`}
              >
                <div className="flex justify-between items-start">
                  <h4 className={`text-xs font-bold ${notif.read ? 'text-[#777777]' : 'text-[#292929]'}`}>{notif.title}</h4>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                    {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-[10px] text-[#777777] font-medium leading-relaxed">{notif.message}</p>
              </motion.div>
            ))}
            {notifications.length === 0 && (
              <div className="bg-white/50 border border-dashed border-gray-200 rounded-3xl py-10 flex flex-col items-center justify-center text-center">
                <Activity size={24} className="text-gray-300 mb-2 opacity-30" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent activity</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
