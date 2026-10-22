import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
  secondaryColor: string;
}

const RIPPLE_COLORS = [
  { primary: 'rgba(216, 27, 96, 0.65)', secondary: 'rgba(255, 183, 77, 0.5)' },   // Hot Pink + Gold
  { primary: 'rgba(255, 64, 129, 0.7)', secondary: 'rgba(255, 128, 171, 0.5)' },  // Rose Pink + Soft Pink
  { primary: 'rgba(233, 30, 99, 0.65)', secondary: 'rgba(255, 215, 0, 0.6)' },    // Magenta + Bright Gold
  { primary: 'rgba(194, 24, 91, 0.7)', secondary: 'rgba(240, 98, 146, 0.5)' },   // Deep Rose + Light Pink
];

interface WaterRippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const WaterRippleButton: React.FC<WaterRippleButtonProps> = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colorPair = RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: colorPair.primary,
      secondaryColor: colorPair.secondary
    };

    setRipples(prev => [...prev.slice(-3), newRipple]);

    if (onClick) {
      onClick(e);
    }
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Liquid Water Color Ripples Layer */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden z-10 rounded-[inherit]">
        <AnimatePresence>
          {ripples.map(r => (
            <React.Fragment key={r.id}>
              {/* Primary Ink Drop Spread */}
              <motion.span
                initial={{ scale: 0, opacity: 0.9, width: 24, height: 24 }}
                animate={{ 
                  scale: 14, 
                  opacity: 0,
                  filter: "blur(3px)" 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => removeRipple(r.id)}
                style={{
                  position: 'absolute',
                  top: r.y - 12,
                  left: r.x - 12,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${r.color} 0%, ${r.secondaryColor} 70%, transparent 100%)`,
                  boxShadow: `0 0 25px ${r.color}`,
                }}
              />
              {/* Secondary Water Color Wave */}
              <motion.span
                initial={{ scale: 0, opacity: 0.7, width: 16, height: 16 }}
                animate={{ 
                  scale: 10, 
                  opacity: 0,
                  filter: "blur(4px)" 
                }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.8, 0.25, 1] }}
                style={{
                  position: 'absolute',
                  top: r.y - 8,
                  left: r.x - 8,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${r.secondaryColor} 0%, transparent 100%)`,
                }}
              />
            </React.Fragment>
          ))}
        </AnimatePresence>
      </span>

      {/* Button Content */}
      <span className="relative z-20 flex items-center justify-center gap-2 w-full h-full pointer-events-none">
        {children}
      </span>
    </button>
  );
};
