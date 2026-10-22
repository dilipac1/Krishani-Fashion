import React, { useState } from 'react';
import { useStore } from '../store';
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, PieChart, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const ReportsView = () => {
  const { orders } = useStore();
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  const filteredOrders = orders.filter(o => (o.createdAt || '').startsWith(dateStr) && o.status !== 'Cancelled');
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const prevDate = new Date(new Date(dateStr).getTime() - 86400000).toISOString().split('T')[0];
  const prevOrders = orders.filter(o => (o.createdAt || '').startsWith(prevDate) && o.status !== 'Cancelled');
  const prevSales = prevOrders.reduce((sum, o) => sum + o.total, 0);
  const growth = prevSales === 0 ? 100 : Math.round(((totalSales - prevSales) / prevSales) * 100);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30 hide-scrollbar pb-24">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 shadow-sm z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#292929]">Analytics</h2>
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#F72578]">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              type="date" 
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#F72578]/10 transition-all"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-pink-50 text-[#F72578] flex items-center justify-center hover:bg-pink-100 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Main KPI Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <PieChart size={64} className="text-pink-50/50" />
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-black text-[#777777] uppercase tracking-widest mb-2">Daily Revenue</p>
            <h3 className="text-4xl font-black text-[#292929] mb-4">Rs. {totalSales.toLocaleString()}</h3>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(growth)}% vs Yesterday</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-[#777777] uppercase tracking-widest mb-2">Orders</p>
            <p className="text-2xl font-black text-[#292929]">{totalOrders}</p>
            <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-[#777777] uppercase tracking-widest mb-2">Avg Order</p>
            <p className="text-2xl font-black text-[#292929]">Rs. {avgOrderValue > 1000 ? `${(avgOrderValue/1000).toFixed(1)}k` : avgOrderValue}</p>
            <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-pink-400 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>

        {/* Sales Breakdown (Visual) */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black text-[#292929] uppercase tracking-widest">Performance Insights</h4>
            <Info size={14} className="text-gray-300" />
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Popular Category', val: 'Tops', color: 'bg-pink-500' },
              { label: 'Customer Growth', val: '+12%', color: 'bg-emerald-500' },
              { label: 'Return Rate', val: '0.4%', color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#777777]">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[#292929]">{item.val}</span>
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button className="w-full py-4 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:bg-black transition-all">
          <Download size={14} />
          Generate Detailed PDF
        </button>
      </div>
    </div>
  );
};
