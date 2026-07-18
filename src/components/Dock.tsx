import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export interface DockApp {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isOpen?: boolean;
  notification?: number;
}

interface DockProps {
  apps: DockApp[];
  separator?: number[]; // indices after which to show separator
}

function DockItem({ app, mouseX, index }: { app: DockApp; mouseX: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // macOS-style magnification calculation
  const widthSync = useTransform(mouseX, (val: number) => {
    const el = ref.current;
    if (!el) return 48;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(val - center);
    const maxDist = 100;
    
    // macOS-style curve: bigger effect closer to cursor
    if (dist > maxDist) return 48;
    const scale = Math.pow(1 - dist / maxDist, 2);
    return 48 + 36 * scale;
  });

  const width = useSpring(widthSync, { 
    stiffness: 400, 
    damping: 25,
    mass: 0.8 
  });

  const handleClick = () => {
    setIsBouncing(true);
    app.onClick();
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div 
      className="flex flex-col items-center gap-1 relative" 
      ref={ref}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* macOS-style tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800/95 text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap backdrop-blur-md border border-white/10 shadow-lg z-50"
          >
            {app.label}
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800/95 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ width, height: width }}
        className="relative flex items-center justify-center cursor-pointer"
        onClick={handleClick}
        animate={isBouncing ? {
          y: [0, -20, 0, -10, 0],
          transition: { duration: 0.6, ease: 'easeOut' }
        } : {}}
        whileTap={{ scale: 0.85 }}
      >
        {/* Icon container with macOS icon styling */}
        <motion.div 
          className="w-full h-full flex items-center justify-center rounded-[22%] overflow-hidden shadow-lg"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {app.icon}
        </motion.div>
        
        {/* Notification badge */}
        {app.notification !== undefined && app.notification > 0 && (
          <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-gray-900">
            <span className="text-white text-[9px] font-bold">{app.notification}</span>
          </div>
        )}
      </motion.div>
      
      {/* macOS-style running indicator dot */}
      <motion.div 
        className={`w-1 h-1 rounded-full ${app.isOpen ? 'bg-white/80' : 'bg-transparent'}`}
        animate={{ 
          scale: app.isOpen ? 1 : 0,
          opacity: app.isOpen ? 1 : 0 
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );
}

// macOS-style separator line
function DockSeparator() {
  return (
    <div className="flex items-end pb-3">
      <div 
        className="w-px h-8 rounded-full" 
        style={{ background: 'rgba(255,255,255,0.2)' }} 
      />
    </div>
  );
}

export default function Dock({ apps, separator = [] }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.5 }}
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 px-2 pb-2"
    >
      <div
        className="flex items-end gap-1 px-3 py-2 rounded-[22px]"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(0,0,0,0.1)',
        }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {apps.map((app, i) => (
          <div key={app.id} className="flex items-end gap-1">
            {separator.includes(i) && <DockSeparator />}
            <DockItem app={app} mouseX={mouseX} index={i} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
