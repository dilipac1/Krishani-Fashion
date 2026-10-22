import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
  secondaryColor: string;
  tertiaryColor: string;
}

const RIPPLE_COLORS = [
  { primary: 'rgba(216, 27, 96, 0.45)', secondary: 'rgba(255, 183, 77, 0.3)', tertiary: 'rgba(255, 64, 129, 0.2)' },   // Hot Pink + Gold
  { primary: 'rgba(255, 64, 129, 0.5)', secondary: 'rgba(255, 128, 171, 0.3)', tertiary: 'rgba(233, 30, 99, 0.2)' },  // Rose Pink + Soft Pink
  { primary: 'rgba(233, 30, 99, 0.45)', secondary: 'rgba(255, 215, 0, 0.4)', tertiary: 'rgba(255, 183, 77, 0.2)' },    // Magenta + Bright Gold
  { primary: 'rgba(194, 24, 91, 0.5)', secondary: 'rgba(240, 98, 146, 0.3)', tertiary: 'rgba(216, 27, 96, 0.2)' },   // Deep Rose + Light Pink
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
      secondaryColor: colorPair.secondary,
      tertiaryColor: colorPair.tertiary
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
              {/* Primary Ink Drop Spread - Larger, softer blur */}
              <motion.span
                initial={{ scale: 0, opacity: 0.8, width: 30, height: 30 }}
                animate={{ 
                  scale: 16, 
                  opacity: 0,
                  filter: "blur(8px)" 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.1, 0.5, 0.2, 1] }}
                onAnimationComplete={() => removeRipple(r.id)}
                style={{
                  position: 'absolute',
                  top: r.y - 15,
                  left: r.x - 15,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${r.color} 0%, ${r.secondaryColor} 40%, ${r.tertiaryColor} 70%, transparent 100%)`,
                }}
              />
              {/* Secondary Water Color Wave - Slower, more organic */}
              <motion.span
                initial={{ scale: 0, opacity: 0.6, width: 20, height: 20 }}
                animate={{ 
                  scale: 12, 
                  opacity: 0,
                  filter: "blur(12px)" 
                }}
                transition={{ duration: 1.8, delay: 0.1, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  top: r.y - 10,
                  left: r.x - 10,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${r.secondaryColor} 0%, transparent 80%)`,
                }}
              />
              {/* Small accent drop */}
              <motion.span
                initial={{ scale: 0, opacity: 0.9, width: 10, height: 10 }}
                animate={{ 
                  scale: 8, 
                  opacity: 0,
                  filter: "blur(4px)" 
                }}
                transition={{ duration: 0.8, ease: "circOut" }}
                style={{
                  position: 'absolute',
                  top: r.y - 5,
                  left: r.x - 5,
                  borderRadius: '50%',
                  background: r.color,
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
