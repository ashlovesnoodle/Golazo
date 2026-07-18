import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Image, FileText, Globe } from 'lucide-react';
import { desktopItems, blogPosts, socialLinks } from '../data/portfolioData';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export default function Spotlight({ isOpen, onClose, onOpenApp }: SpotlightProps) {
  const [query, setQuery] = useState('');

  const allItems = [
    ...desktopItems.map((i) => ({ id: i.id, title: i.title, type: 'Portfolio', icon: <Image size={14} />, appId: 'finder' })),
    ...blogPosts.map((p) => ({ id: p.id, title: p.title, type: 'Blog', icon: <FileText size={14} />, appId: 'notes' })),
    ...socialLinks.map((s) => ({ id: s.platform, title: s.platform, type: 'Social', icon: <Globe size={14} />, appId: s.icon })),
  ];

  const results = query.trim()
    ? allItems.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.2)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] z-[101] rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(30,30,34,0.92)',
              backdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <Search size={18} className="text-white/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent text-white text-xl outline-none placeholder-white/30"
                onKeyDown={(e) => e.key === 'Escape' && onClose()}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/60 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="py-2 max-h-80 overflow-y-auto">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => {
                      onOpenApp(result.appId);
                      onClose();
                      setQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/8 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                      {result.icon}
                    </div>
                    <div>
                      <p className="text-sm text-white/90 font-medium">{result.title}</p>
                      <p className="text-xs text-white/40">{result.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="px-5 py-6 text-center text-white/30 text-sm">
                No results for "{query}"
              </div>
            )}

            {!query && (
              <div className="px-5 py-4 grid grid-cols-3 gap-2">
                {['Finder', 'Photos', 'Notes', 'Mail', 'Instagram', 'About Me'].map((app) => (
                  <button
                    key={app}
                    onClick={() => {
                      onOpenApp(app.toLowerCase().replace(' ', ''));
                      onClose();
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/8 transition-colors text-left"
                  >
                    <span className="text-white/60 text-xs">{app}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
