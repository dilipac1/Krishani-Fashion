import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, markNotificationAsRead } = useStore();
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
      // Show the most recent unread
      const latest = unread[0];
      setActiveToast(latest.id);
      
      const timer = setTimeout(() => {
        markNotificationAsRead(latest.id);
        setActiveToast(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, markNotificationAsRead]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-white border-l-4 border-amber-400 shadow-xl rounded-lg p-4 w-full max-w-sm flex items-start space-x-3 pointer-events-auto"
          >
            <div className="bg-pink-100 p-2 rounded-full text-pink-600">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">
                {notifications.find(n => n.id === activeToast)?.title}
              </h4>
              <p className="text-sm text-gray-600">
                {notifications.find(n => n.id === activeToast)?.message}
              </p>
            </div>
            <button 
              onClick={() => {
                markNotificationAsRead(activeToast);
                setActiveToast(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
