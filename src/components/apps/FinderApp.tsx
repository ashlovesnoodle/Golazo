import { useState } from 'react';
import { desktopItems, type DesktopItem } from '../../data/portfolioData';
import { Search, ChevronRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoViewer from './PhotoViewer';
import VideoThumbnail from '../VideoThumbnail';

const isVideoFile = (path: string) => /\.(mp4|mov|avi|webm|mkv)$/i.test(path);

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  images: { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-400' },
  videos: { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
  blog: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  photographs: { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
};

// Authentic macOS blue folder icon
const FolderIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0">
    <defs>
      <linearGradient id="folderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="folderGradientOpen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>
    <path
      d="M2 3C2 2.44772 2.44772 2 3 2H6L8 4H13C13.5523 4 14 4.44772 14 5V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V3Z"
      fill={isOpen ? "url(#folderGradientOpen)" : "url(#folderGradient)"}
    />
    <path
      d="M2 4.5C2 3.94772 2.44772 3.5 3 3.5H13C13.5523 3.5 14 3.94772 14 4.5V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4.5Z"
      fill={isOpen ? "url(#folderGradientOpen)" : "url(#folderGradient)"}
      opacity="0.9"
    />
  </svg>
);

// Thumbnail component for icon view
const ThumbnailIcon = ({ src, title }: { src: string; title: string }) => (
  <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-gray-100">
    {isVideoFile(src) ? (
      <VideoThumbnail src={src} alt={title} className="w-full h-full object-cover" />
    ) : (
      <img 
        src={src} 
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    )}
  </div>
);

// Small thumbnail for list view
const ListThumbnail = ({ src, title }: { src: string; title: string }) => (
  <div className="w-full h-full rounded overflow-hidden bg-gray-100">
    {isVideoFile(src) ? (
      <VideoThumbnail src={src} alt={title} className="w-full h-full object-cover" />
    ) : (
      <img 
        src={src} 
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    )}
  </div>
);

// View mode icons (macOS style)
const IconViewButton = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" className="w-4 h-4">
    <rect x="2" y="2" width="5" height="5" rx="1" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
    <rect x="9" y="2" width="5" height="5" rx="1" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
    <rect x="2" y="9" width="5" height="5" rx="1" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
    <rect x="9" y="9" width="5" height="5" rx="1" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
  </svg>
);

const ListViewButton = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" className="w-4 h-4">
    <rect x="2" y="3" width="12" height="2" rx="0.5" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
    <rect x="2" y="7" width="12" height="2" rx="0.5" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
    <rect x="2" y="11" width="12" height="2" rx="0.5" fill={active ? "white" : "rgba(255,255,255,0.4)"} />
  </svg>
);

// Folder structure: Images, Videos, Blog, Photographs
const folders = [
  { id: 'all', label: 'Recents', section: 'Favorites' },
  { id: 'images', label: 'Images', section: 'Favorites' },
  { id: 'videos', label: 'Videos', section: 'Favorites' },
  { id: 'photographs', label: 'Photographs', section: 'Favorites' },
];

export default function FinderApp() {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [view, setView] = useState<'icon' | 'list'>('list');
  const [selectedItem, setSelectedItem] = useState<DesktopItem | null>(null);
  const [search, setSearch] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerScale, setViewerScale] = useState(0.5);

  const filtered = desktopItems.filter((item) => {
    const matchesFolder = selectedFolder === 'all' || item.category === selectedFolder;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const openViewer = (item: DesktopItem) => {
    const index = filtered.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setViewerIndex(index);
      setViewerScale(0.5); // Open at 50% zoom
      setViewerOpen(true);
    }
  };

  // Group items for sidebar display
  const groupedItems = folders.reduce((acc, folder) => {
    if (!acc[folder.section]) acc[folder.section] = [];
    acc[folder.section].push(folder);
    return acc;
  }, {} as Record<string, typeof folders>);

  return (
    <div className="flex h-full bg-[#1e1e1e]">
      {/* Sidebar - macOS style */}
      <div 
        className="w-48 flex-shrink-0 flex flex-col py-3 select-none"
        style={{ 
          background: 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)',
          borderRight: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        {Object.entries(groupedItems).map(([section, items], sectionIndex) => (
          <div key={section} className={sectionIndex > 0 ? 'mt-4' : ''}>
            <p className="text-[11px] text-gray-500 px-3 py-1.5 font-semibold tracking-wide">{section}</p>
            <div className="px-2">
              {items.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`flex items-center gap-2 w-full px-2.5 py-1 text-[13px] rounded-md transition-all ${
                    selectedFolder === folder.id
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 hover:bg-black/5'
                  }`}
                  style={selectedFolder === folder.id ? {
                    background: 'linear-gradient(180deg, #0A84FF 0%, #0070E0 100%)',
                  } : {}}
                >
                  <FolderIcon isOpen={selectedFolder === folder.id} />
                  <span className="truncate">{folder.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Tags section */}
        <div className="mt-4">
          <p className="text-[11px] text-gray-500 px-3 py-1.5 font-semibold tracking-wide">Tags</p>
          <div className="px-2">
            {[
              { name: 'Images', color: 'bg-blue-400' },
              { name: 'Videos', color: 'bg-red-400' },
              { name: 'Blog', color: 'bg-yellow-400' },
              { name: 'Photographs', color: 'bg-green-400' },
            ].map((tag) => (
              <button
                key={tag.name}
                className="flex items-center gap-2 w-full px-2.5 py-1 text-[13px] text-gray-700 rounded-md hover:bg-black/5 transition-all"
              >
                <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                <Tag size={12} className="text-gray-400 ml-0.5" />
                <span className="truncate">{tag.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar - macOS style */}
        <div 
          className="flex items-center gap-3 px-4 py-2 border-b"
          style={{ 
            background: 'rgba(240,240,240,0.85)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(0,0,0,0.08)'
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-gray-500 text-[13px]">
            <FolderIcon />
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium">{folders.find((f) => f.id === selectedFolder)?.label}</span>
          </div>
          <div className="flex-1" />
          {/* Search */}
          <div 
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          >
            <Search size={14} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-gray-700 text-[13px] outline-none w-32 placeholder-gray-400"
            />
          </div>
          {/* View toggles */}
          <div 
            className="flex items-center gap-0.5 rounded-lg p-0.5"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          >
            <button
              onClick={() => setView('icon')}
              className="p-1.5 rounded-md transition-all"
              style={view === 'icon' ? { background: 'rgba(0,0,0,0.15)' } : {}}
            >
              <IconViewButton active={view === 'icon'} />
            </button>
            <button
              onClick={() => setView('list')}
              className="p-1.5 rounded-md transition-all"
              style={view === 'list' ? { background: 'rgba(0,0,0,0.15)' } : {}}
            >
              <ListViewButton active={view === 'list'} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* File area */}
          <div className="flex-1 overflow-y-auto p-4 min-w-0">
            {view === 'icon' ? (
              <div className={`grid gap-x-6 gap-y-8 ${selectedItem ? 'grid-cols-3 lg:grid-cols-4' : 'grid-cols-4 lg:grid-cols-5'}`}>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: i * 0.03, 
                      type: 'spring', 
                      stiffness: 350, 
                      damping: 28,
                      mass: 0.8
                    }}
                    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                    onDoubleClick={() => openViewer(item)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer group ${
                      selectedItem?.id === item.id ? 'bg-[#0A84FF]/30' : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="w-20 h-20 flex items-center justify-center">
                      <ThumbnailIcon src={item.image} title={item.title} />
                    </div>
                    <div className={`px-2 py-0.5 rounded-md ${selectedItem?.id === item.id ? 'bg-[#0A84FF]' : ''}`}>
                      <p className={`text-[12px] text-center leading-tight max-w-[100px] truncate ${selectedItem?.id === item.id ? 'text-white' : 'text-gray-700'}`}>
                        {item.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: i * 0.02,
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }}
                    whileHover={{ x: 3, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                    onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                    onDoubleClick={() => openViewer(item)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? 'bg-[#0A84FF]' : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                      <ListThumbnail src={item.image} title={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-medium truncate ${selectedItem?.id === item.id ? 'text-white' : 'text-gray-700'}`}>
                        {item.title}
                      </p>
                      <p className={`text-[11px] truncate ${selectedItem?.id === item.id ? 'text-white/70' : 'text-gray-500'}`}>
                        {item.description || item.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${categoryColors[item.category]?.dot || 'bg-gray-400'}`} />
                      <span className={`text-[11px] capitalize ${selectedItem?.id === item.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Preview panel - macOS Info panel style */}
          <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-56 border-l p-4 flex flex-col gap-4 flex-shrink-0"
              style={{ 
                background: 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)',
                borderColor: 'rgba(0,0,0,0.08)'
              }}
            >
              {/* Large thumbnail preview */}
              <div className="w-full aspect-square max-w-[200px] mx-auto rounded-lg overflow-hidden shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                   onClick={() => openViewer(selectedItem)}>
                {isVideoFile(selectedItem.image) ? (
                  <VideoThumbnail src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-contain" />
                ) : (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              {/* File info */}
              <div className="text-center">
                <p className="text-[15px] font-semibold text-gray-800">{selectedItem.title}</p>
                <p className="text-[12px] text-gray-500 mt-0.5 capitalize">{selectedItem.category}</p>
              </div>

              {selectedItem.description && (
                <p className="text-[11px] text-gray-500 leading-relaxed">{selectedItem.description}</p>
              )}
              
              {selectedItem.link && (
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#0A84FF] hover:underline truncate"
                >
                  {selectedItem.link}
                </a>
              )}

              {/* Open button */}
              <button
                onClick={() => openViewer(selectedItem)}
                className="w-full py-2 px-4 rounded-lg text-[13px] font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(180deg, #0A84FF 0%, #0070E0 100%)',
                }}
              >
                Open
              </button>

              {/* Metadata section */}
              <div className="mt-auto pt-4 border-t border-gray-300/50">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Info</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Kind</span>
                    <span className="text-gray-700">{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-700 capitalize">{selectedItem.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Photo Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer
            items={filtered}
            initialIndex={viewerIndex}
            initialScale={viewerScale}
            onClose={() => {
              setViewerOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
