import { useState } from 'react';
import { blogPosts, type BlogPost } from '../../data/portfolioData';
import { sanitizeAsset } from '../../utils/asset';
import { Search, Plus, ChevronRight } from 'lucide-react';

export default function NotesApp() {
  const [selected, setSelected] = useState<BlogPost | null>(blogPosts[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes] = useState(blogPosts);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="w-60 flex-shrink-0 flex flex-col border-r"
        style={{ background: '#2c2c2e', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <Search size={12} className="text-white/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-white/80 text-sm outline-none flex-1 placeholder-white/30"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelected(note)}
              className={`w-full text-left px-4 py-3 border-b transition-colors ${
                selected?.id === note.id
                  ? 'bg-yellow-500/20 border-yellow-500/30'
                  : 'hover:bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/90 truncate pr-2">{note.title}</p>
                <ChevronRight size={12} className="text-white/30 flex-shrink-0" />
              </div>
              <p className="text-xs text-white/40 mt-0.5">{formatDate(note.date)}</p>
              <p className="text-xs text-white/50 mt-1 truncate">{note.excerpt}</p>
            </button>
          ))}
        </div>

        {/* New note button */}
        <div className="p-3 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-medium transition-colors">
            <Plus size={14} />
            New Note
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#1c1c1e' }}>
        {selected ? (
          <>
            {selected.coverImage && (
              <div className="mb-6 rounded-xl overflow-hidden h-48">
                <img src={sanitizeAsset(selected.coverImage)} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/30 uppercase tracking-widest">{formatDate(selected.date)}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Blog</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{selected.title}</h1>
            <p className="text-white/50 text-sm mb-6 italic">{selected.excerpt}</p>
            <div className="space-y-4">
              {selected.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-white/75 text-sm leading-relaxed">
                  {para.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.startsWith('**') && line.endsWith('**')
                        ? <strong className="text-white font-semibold">{line.replace(/\*\*/g, '')}</strong>
                        : line}
                      {j < para.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-sm">
            Select a note to read
          </div>
        )}
      </div>
    </div>
  );
}
