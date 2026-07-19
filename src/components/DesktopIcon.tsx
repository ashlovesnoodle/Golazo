import { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { type DesktopItem } from '../data/portfolioData';
import VideoThumbnail from './VideoThumbnail';
import { sanitizeAsset } from '../utils/asset';
import OptimizedImage from './OptimizedImage';
interface DesktopIconProps {
  item: DesktopItem;
  onClick: (item: DesktopItem) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
}

const isVideoFile = (path: string) => /\.(mp4|mov|avi|webm|mkv)$/i.test(path);

export default function DesktopIcon({ item, onClick, onPositionChange }: DesktopIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: Math.random() * 0.15 
      }}
      drag
      dragMomentum={false}
      dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
      dragElastic={0.1}
      style={{
        x,
        y,
        left: `${item.x}%`,
        top: `${item.y}%`,
        position: 'absolute',
        zIndex: isDragging ? 1000 : 1,
      }}
      onDragStart={() => {
        setIsDragging(true);
        dragOrigin.current = { x: x.get(), y: y.get() };
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (onPositionChange) {
          const containerWidth = window.innerWidth;
          const containerHeight = window.innerHeight - 160;
          // Calculate exact position where dropped without clamping
          const newX = item.x + (info.offset.x / containerWidth) * 100;
          const newY = item.y + (info.offset.y / containerHeight) * 100;
          // Reset motion values BEFORE updating parent state to prevent jump
          x.set(0);
          y.set(0);
          onPositionChange(item.id, newX, newY);
        }
      }}
      className="flex flex-col items-center gap-1.5 cursor-default group select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onDoubleClick={() => onClick(item)}
      onClick={() => {
        if (!isDragging) onClick(item);
      }}
      whileHover={!isDragging ? { scale: 1.15, transition: { type: 'spring', stiffness: 500, damping: 15 } } : {}}
      whileTap={{ scale: 0.92, transition: { type: 'spring', stiffness: 600, damping: 20 } }}
    >
      {/* Icon image - macOS style */}
      <motion.div
        className="relative rounded-xl overflow-hidden shadow-2xl"
        animate={{
          scale: isDragging ? 1.1 : isHovered ? 1.05 : 1,
          y: isDragging ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          width: 80,
          height: 80,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: isDragging 
            ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.3)'
            : '0 8px 24px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {isVideoFile(item.image) ? (
          item.thumbnail ? (
            <OptimizedImage src={sanitizeAsset(item.thumbnail)} alt={item.title} className="w-full h-full object-cover pointer-events-none select-none" draggable="false" priority="low" />
          ) : (
            <VideoThumbnail src={sanitizeAsset(item.image)} alt={item.title} className="w-full h-full object-cover pointer-events-none select-none" seekToTime={item.seekToTime} />
          )
        ) : (
            <OptimizedImage src={sanitizeAsset(item.image)} alt={item.title} className="w-full h-full object-cover pointer-events-none select-none" draggable="false" priority="low" />
        )}
        {/* macOS-style subtle border highlight */}
        <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
        {/* Hover glow */}
        {isHovered && (
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        )}
        {/* Drag lift effect */}
        {isDragging && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        )}
      </motion.div>

      {/* Label - macOS style */}
      <motion.div
        className="max-w-[90px]"
        animate={{
          y: isDragging ? -3 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <p 
          className="text-white text-[12px] font-medium text-center leading-tight tracking-tight line-clamp-2 drop-shadow-lg pointer-events-none select-none"
          style={{
            textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {item.title}
        </p>
      </motion.div>
    </motion.div>
  );
}
