import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import Spotlight from './components/Spotlight';
import NotesApp from './components/apps/NotesApp';
import PhotosApp from './components/apps/PhotosApp';
import FinderApp from './components/apps/FinderApp';
import PhotoViewer from './components/apps/PhotoViewer';
import MailApp from './components/apps/MailApp';
import SocialApp from './components/apps/SocialApp';
import AboutApp from './components/apps/AboutApp';
import PhotoshopErrorApp from './components/apps/PhotoshopErrorApp';
import SafariApp from './components/apps/SafariApp';
import MacOSPreloader from './components/MacOSPreloader';
import { desktopItems, socialLinks, type DesktopItem } from './data/portfolioData';
import { profile } from './data/portfolioData';
import { sanitizeAsset } from './utils/asset';

function getRandomizedDesktopItems(items: DesktopItem[]): DesktopItem[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const placed: Array<{ x: number; y: number }> = [];
  const minDistance = 14;

  return shuffled.map((item) => {
    let x: number;
    let y: number;
    let attempts = 0;

    do {
      x = 8 + Math.random() * 74;
      y = 10 + Math.random() * 70;
      attempts += 1;
    } while (
      attempts < 100 &&
      placed.some((pos) => Math.hypot((pos.x - x) * 1.1, pos.y - y) < minDistance)
    );

    placed.push({ x, y });
    return {
      ...item,
      x,
      y,
    };
  });
}

// ── Dock icon SVGs ──────────────────────────────────────────────────────────
const PsIcon = () => (
  <div className="w-full h-full rounded-[22%] overflow-hidden">
    <img src="/photoshop.png" alt="Photoshop" className="w-full h-full object-cover" />
  </div>
);

const FinderIcon = () => (
  <div className="w-full h-full rounded-[22%] overflow-hidden">
    <img src="/finder.png" alt="Finder" className="w-full h-full object-cover" />
  </div>
);

const NotesIcon = () => (
  <div className="w-full h-full rounded-[22%] flex flex-col overflow-hidden bg-[#FFFDE7] shadow-lg">
    <div className="h-3 flex-shrink-0 bg-[#FDD835]" />
    <div className="flex-1 p-2 space-y-1.5 flex flex-col justify-center">
      <div className="rounded-sm" style={{ height: 3, width: '90%', background: '#E0E0E0' }} />
      <div className="rounded-sm" style={{ height: 3, width: '70%', background: '#E0E0E0' }} />
      <div className="rounded-sm" style={{ height: 3, width: '80%', background: '#E0E0E0' }} />
    </div>
  </div>
);

const PhotosIcon = () => (
  <div className="w-full h-full rounded-[22%] overflow-hidden bg-white shadow-lg flex items-center justify-center">
    <div className="relative w-10 h-10">
      {/* Color wheel */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const colors = ['#FF3B30', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#FF9500'];
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 35 * Math.cos(rad);
        const y = 50 + 35 * Math.sin(rad);
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors[i],
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}
    </div>
  </div>
);

const InstagramIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
    </svg>
  </div>
);

const LinkedInIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center" style={{ background: '#0A66C2' }}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  </div>
);

const TwitterIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center" style={{ background: '#000' }}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </div>
);

const MailIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #5AC8FA 0%, #0A84FF 100%)' }}>
    <div className="relative w-6 h-6">
      {/* White envelope outline */}
      <svg viewBox="0 0 24 24" className="w-full h-full absolute inset-0" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
      {/* Red circle with @ symbol */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold leading-none">@</span>
      </div>
    </div>
  </div>
);

const SafariIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)' }}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Compass circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Cardinal marks */}
      <line x1="12" y1="2" x2="12" y2="4" strokeWidth="1.5" />
      <line x1="22" y1="12" x2="20" y2="12" strokeWidth="1.5" />
      <line x1="12" y1="22" x2="12" y2="20" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="4" y2="12" strokeWidth="1.5" />
      {/* Compass needle - red pointing northeast */}
      <path d="M 12 12 L 16 6 L 14 11 Z" fill="#FF5252" stroke="none" />
      <path d="M 12 12 L 14 18 L 11 13 Z" fill="rgba(255,255,255,0.3)" stroke="none" />
    </svg>
  </div>
);

const TrashIcon = ({ full }: { full?: boolean }) => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center" style={{ background: 'rgba(120,120,128,0.2)' }}>
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
      <path d="M12 14h24l-2 24H14L12 14z" stroke="rgba(200,200,210,0.9)" strokeWidth="2" fill="rgba(80,80,90,0.4)" />
      <path d="M8 14h32" stroke="rgba(200,200,210,0.9)" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 14V10h12v4" stroke="rgba(200,200,210,0.9)" strokeWidth="2" strokeLinecap="round" />
      {full && <path d="M20 20v12M24 20v12M28 20v12" stroke="rgba(200,200,210,0.7)" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  </div>
);

const AboutIcon = () => (
  <div className="w-full h-full rounded-[22%] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)' }}>
          <img src={sanitizeAsset(profile.avatar)} alt="" className="w-full h-full object-cover opacity-80" />
  </div>
);

// ── Window state ────────────────────────────────────────────────────────────
interface WindowState {
  id: string;
  title: string;
  icon: string;
  appId: string;
  zIndex: number;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
}

let zCounter = 100;

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DesktopItem | null>(null);
  const [items, setItems] = useState<DesktopItem[]>(() => getRandomizedDesktopItems(desktopItems));
  const [viewerItems, setViewerItems] = useState<DesktopItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const openWindow = useCallback((appId: string, title: string, icon: string, opts?: Partial<WindowState>) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);
      if (existing) {
        zCounter++;
        return prev.map((w) => w.appId === appId ? { ...w, zIndex: zCounter } : w);
      }
      zCounter++;
      return [
        ...prev,
        {
          id: `${appId}-${Date.now()}`,
          title,
          icon,
          appId,
          zIndex: zCounter,
          initialX: 60 + prev.length * 30,
          initialY: 40 + prev.length * 20,
          width: 720,
          height: 520,
          ...opts,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter++;
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: zCounter } : w));
  }, []);

  const handleDesktopItemClick = (item: DesktopItem) => {
    setSelectedItem(item);
    setViewerItems([item]);
    setViewerIndex(0);
    setViewerOpen(true);
  };

  const handleOpenApp = (appId: string) => {
    const appMap: Record<string, [string, string, Partial<WindowState>?]> = {
      finder: ['Finder', '', { width: 760, height: 520 }],
      notes: ['Notes', '', { width: 680, height: 500 }],
      photos: ['Photos', '', { width: 800, height: 560 }],
      mail: ['Mail', '', { width: 800, height: 540 }],
      instagram: ['Instagram', '', { width: 480, height: 600 }],
      linkedin: ['LinkedIn', '', { width: 480, height: 580 }],
      twitter: ['Twitter / X', '', { width: 480, height: 580 }],
      aboutme: ['About Me', '', { width: 500, height: 560 }],
      about: ['About Me', '', { width: 500, height: 560 }],
      photoshop: ['Photoshop', '', { width: 460, height: 380 }],
      safari: ['Safari', '', { width: 900, height: 600 }],
    };
    const [title, icon, opts] = appMap[appId] || ['App', ''];
    openWindow(appId, title, icon, opts);
  };

  const dockApps = [
    {
      id: 'finder',
      label: 'Finder',
      icon: <FinderIcon />,
      onClick: () => handleOpenApp('finder'),
      isOpen: windows.some((w) => w.appId === 'finder'),
    },
    {
      id: 'photoshop',
      label: 'Photoshop',
      icon: <PsIcon />,
      onClick: () => handleOpenApp('photoshop'),
      isOpen: windows.some((w) => w.appId === 'photoshop'),
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <NotesIcon />,
      onClick: () => handleOpenApp('notes'),
      isOpen: windows.some((w) => w.appId === 'notes'),
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: <PhotosIcon />,
      onClick: () => handleOpenApp('photos'),
      isOpen: windows.some((w) => w.appId === 'photos'),
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: <InstagramIcon />,
      onClick: () => {
        window.open('https://www.instagram.com/ashlovesnoodle/', '_blank');
      },
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedInIcon />,
      onClick: () => {
        window.open('https://www.linkedin.com/in/ashlovesnoodle/', '_blank');
      },
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: <TwitterIcon />,
      onClick: () => {
        window.open('https://x.com/ashlovesnoodle_/', '_blank');
      },
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: <MailIcon />,
      onClick: () => {
        window.open('mailto:apsinghftp13@gmail.com', '_blank');
      },
    },
    {
      id: 'aboutme',
      label: 'About Me',
      icon: <AboutIcon />,
      onClick: () => handleOpenApp('aboutme'),
      isOpen: windows.some((w) => w.appId === 'aboutme'),
    },
    {
      id: 'safari',
      label: 'Safari',
      icon: <SafariIcon />,
      onClick: () => handleOpenApp('safari'),
      isOpen: windows.some((w) => w.appId === 'safari'),
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: <TrashIcon />,
      onClick: () => {},
    },
  ];

  const getWindowContent = (w: WindowState) => {
    const igLink = socialLinks.find((s) => s.icon === 'instagram');
    const liLink = socialLinks.find((s) => s.icon === 'linkedin');
    const twLink = socialLinks.find((s) => s.icon === 'twitter');

    switch (w.appId) {
      case 'finder': return <FinderApp />;
      case 'notes': return <NotesApp />;
      case 'photos': return <PhotosApp />;
      case 'mail': return <MailApp />;
      case 'instagram': return <SocialApp platform="instagram" url={igLink?.url || 'https://instagram.com'} />;
      case 'linkedin': return <SocialApp platform="linkedin" url={liLink?.url || 'https://linkedin.com'} />;
      case 'twitter': return <SocialApp platform="twitter" url={twLink?.url || 'https://twitter.com'} />;
      case 'aboutme':
      case 'about': return <AboutApp />;
      case 'photoshop': return <PhotoshopErrorApp />;
      case 'safari': return <SafariApp />;
      default: return <div className="flex items-center justify-center h-full text-white/30 text-sm">App not found</div>;
    }
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden relative select-none"
      style={{ background: '#0a0a0a' }}
    >
      {/* macOS Boot Preloader */}
      <MacOSPreloader onComplete={() => setPreloaderComplete(true)} />

      {/* Main Desktop - fades in after preloader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
      >
      {/* Desktop background — blurred portrait */}
      <div className="absolute inset-0">
        <img
          src={sanitizeAsset(profile.backgroundImage)}
          alt="background"
          className="w-full h-full object-cover object-top"
          style={{ filter: 'blur(0px) brightness(0.45) saturate(0.8)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
      </div>

      {/* Menu Bar */}
      <MenuBar onSpotlight={() => setSpotlightOpen(true)} />

      {/* Desktop Icons */}
      <div className="absolute inset-0 top-7 bottom-20">
        {items.map((item) => (
          <DesktopIcon
            key={item.id}
            item={item}
            onClick={handleDesktopItemClick}
            onPositionChange={(id, x, y) => {
              setItems((prev) => prev.map((i) => (i.id === id ? { ...i, x, y } : i)));
            }}
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((w) => (
          <Window
            key={w.id}
            title={w.title}
            icon={w.icon}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            initialX={w.initialX}
            initialY={w.initialY}
            width={w.width}
            height={w.height}
            zIndex={w.zIndex}
          >
            {getWindowContent(w)}
          </Window>
        ))}
      </AnimatePresence>

      {/* Photo Viewer overlay */}
      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer
            items={viewerItems}
            initialIndex={viewerIndex}
            initialScale={0.75}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dock */}
      <Dock apps={dockApps} separator={[3, 6, 8]} />

      {/* Spotlight */}
      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onOpenApp={handleOpenApp}
      />

      {/* Right-click context menu placeholder (click to deselect) */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setSelectedItem(null)}
        />
      )}
      </motion.div>
    </div>
  );
}
