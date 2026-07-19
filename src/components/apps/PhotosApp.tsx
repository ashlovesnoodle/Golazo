import { useState } from 'react';
import { galleryImages } from '../../data/portfolioData';
import { sanitizeAsset } from '../../utils/asset';
import { X, ChevronLeft, ChevronRight, Grid, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '../OptimizedImage';

const isVideoFile = (url: string) => /\.(mp4|mov|avi|webm|mkv)$/i.test(url);
const photosOnly = galleryImages.filter((img) => !isVideoFile(img.url));
const categories = ['All', ...Array.from(new Set(photosOnly.map((i) => i.category || 'Other')))];

export default function PhotosApp() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered =
    selectedCategory === 'All'
      ? photosOnly
      : photosOnly.filter((i) => i.category === selectedCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : 0));
  const nextImage = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : 0));

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#2c2c2e]">
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-1 rounded transition-colors ${view === 'grid' ? 'bg-white/20 text-white' : 'text-white/40'}`}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1 rounded transition-colors ${view === 'list' ? 'bg-white/20 text-white' : 'text-white/40'}`}
          >
            <Image size={14} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className={`grid gap-2 ${view === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                view === 'list' ? 'h-48' : 'aspect-square'
              }`}
              onClick={() => openLightbox(i)}
            >
              <OptimizedImage
                src={sanitizeAsset(img.url)}
                alt={img.caption || ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-800"
                priority={i < 6 ? 'high' : 'low'}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                  {img.category && (
                    <p className="text-white/50 text-[10px]">{img.category}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/20 text-sm">
            No photos in this category
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={closeLightbox}
              >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={20} className="text-white" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[80%] max-w-[80%]"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={sanitizeAsset(filtered[lightboxIndex].url)}
                alt={filtered[lightboxIndex].caption || ''}
                className="max-h-[80%] max-w-[80%] rounded-xl object-contain bg-gray-900"
                priority="high"
              />
            </motion.div>

            {filtered[lightboxIndex].caption && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <p className="text-white font-medium">{filtered[lightboxIndex].caption}</p>
                <p className="text-white/40 text-sm mt-1">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
