import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { DesktopItem } from '../../data/portfolioData';
import VideoThumbnail from '../VideoThumbnail';

interface PhotoViewerProps {
  items: DesktopItem[];
  initialIndex: number;
  onClose: () => void;
  initialScale?: number;
}

export default function PhotoViewer({ items, initialIndex, onClose, initialScale = 1 }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(initialScale);
  const [isDragging, setIsDragging] = useState(false);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentItem = items[currentIndex];
  const isVideo = currentItem?.category === 'videos' || currentItem?.image?.match(/\.(mp4|mov|avi|webm)$/i);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 3));
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNext, goToPrev]);

  // Auto-play videos when opened or when switching items
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isVideo, currentIndex]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      {/* Header bar - only close and toolbar */}
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(20px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full flex items-center justify-center transition-all"
            style={{ background: '#ff5f56' }}
          >
            <X size={6} className="opacity-0 hover:opacity-100 text-[#4d0000]" />
          </button>
          <p className="text-[11px] text-white/50">
            {currentIndex + 1} of {items.length}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            disabled={scale <= 0.5}
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-[12px] text-white/50 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            disabled={scale >= 3}
          >
            <ZoomIn size={18} />
          </button>
          {currentItem?.link && (
            <a
              href={currentItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all ml-2"
            >
              <Download size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-4 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Media container with title below */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem?.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: isVideo ? 1 : scale, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8
            }}
            drag={!isVideo}
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
            dragElastic={0.15}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            onClick={(e) => {
              if (!isDragging) e.stopPropagation();
            }}
            className="max-w-[85vw] max-h-[80vh] flex flex-col items-center gap-4"
          >
            {isVideo ? (
              // Video player
              <div className="relative max-w-full max-h-[70vh]">
                <video
                  ref={videoRef}
                  src={currentItem?.image}
                  className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
                  autoPlay
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                />
                {/* Video controls overlay */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Progress bar */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer mb-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                  {/* Control buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <span className="text-[12px] text-white/80">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Image viewer
              <img
                src={currentItem?.image}
                alt={currentItem?.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
                draggable={false}
              />
            )}
            {/* Title below media */}
            <p className="text-[14px] font-medium text-white/90 text-center px-4">
              {currentItem?.title}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 }}
          className="flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto"
          style={{ background: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(20px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => {
            const isVideo = item.category === 'videos' || item.image?.match(/\.(mp4|mov|avi|webm)$/i);
            return (
              <motion.button
                key={item.id}
                onClick={() => { setCurrentIndex(index); setScale(1); }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-[#0A84FF] ring-offset-2 ring-offset-black/50' 
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                {isVideo ? (
                  <VideoThumbnail src={sanitizeAsset(item.image)} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <img src={sanitizeAsset(item.image)} alt={item.title} className="w-full h-full object-cover" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
