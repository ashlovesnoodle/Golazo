import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  zIndex?: number;
  onFocus?: () => void;
}

export default function Window({
  title,
  icon,
  children,
  onClose,
  initialX = 100,
  initialY = 60,
  width = 680,
  height = 500,
  minWidth = 400,
  zIndex = 10,
  onFocus,
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag={!isMaximized && window.innerWidth >= 768}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      dragListener={false}
      initial={{ x: window.innerWidth < 768 ? 0 : initialX, y: window.innerWidth < 768 ? 28 : initialY, scale: 0.92, opacity: 0 }}
      animate={{
        x: isMaximized ? 0 : undefined,
        y: isMaximized ? 28 : undefined,
        scale: 1,
        opacity: 1,
        width: isMaximized ? '100vw' : window.innerWidth < 768 ? '100vw' : width,
        height: isMaximized ? 'calc(100vh - 28px)' : window.innerWidth < 768 ? 'calc(100vh - 28px)' : height,
      }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ 
        type: 'spring', 
        stiffness: 600, 
        damping: 40,
        mass: 0.6,
        staggerChildren: 0.05 
      }}
      style={{
        position: 'fixed',
        zIndex,
        minWidth,
        borderRadius: isMaximized ? 0 : 10,
        overflow: 'hidden',
        boxShadow: isMaximized 
          ? 'none'
          : '0 22px 70px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15)',
      }}
      onClick={onFocus}
      className="flex flex-col"
    >
      {/* Title Bar - macOS unified style */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 select-none flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, rgba(245,245,247,0.95) 0%, rgba(232,232,237,0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          cursor: isMaximized ? 'default' : 'grab',
        }}
        onPointerDown={(e) => {
          if (!isMaximized) {
            dragControls.start(e, { snapToCursor: false });
          }
          onFocus?.();
        }}
      >
        {/* Traffic lights - macOS style */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
            style={{ 
              background: '#ff5f56',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06), 0 0.5px 1px rgba(0,0,0,0.15)'
            }}
          >
            <X size={6} className="opacity-0 group-hover:opacity-100 text-[#4d0000]" strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
            style={{ 
              background: '#ffbd2e',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06), 0 0.5px 1px rgba(0,0,0,0.15)'
            }}
          >
            <Minus size={6} className="opacity-0 group-hover:opacity-100 text-[#5a4a00]" strokeWidth={2.5} />
          </button>
          {window.innerWidth >= 768 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
              className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
              style={{ 
                background: '#27c93f',
                boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.06), 0 0.5px 1px rgba(0,0,0,0.15)'
              }}
            >
              <Maximize2 size={5} className="opacity-0 group-hover:opacity-100 text-[#004d00]" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Title */}
        <div className={`flex-1 flex items-center justify-center pointer-events-none ${icon ? 'gap-1.5' : ''}`}>
          {icon && <span className="text-[13px] leading-none">{icon}</span>}
          <span className="text-[13px] font-semibold text-gray-700 tracking-tight">{title}</span>
        </div>

        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ background: '#f5f5f7' }}>
        {children}
      </div>
    </motion.div>
  );
}
