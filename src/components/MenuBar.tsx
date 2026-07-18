import { useState, useEffect } from 'react';
import { Wifi, Battery, Search } from 'lucide-react';

interface MenuBarProps {
  onSpotlight?: () => void;
}

export default function MenuBar({ onSpotlight }: MenuBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center px-2 lg:px-4 z-50 h-7"
      style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 lg:gap-5">
        {/* Apple logo */}
        <button className="text-white/90 hover:text-white transition-colors text-sm font-bold leading-none">
          
        </button>
        <button className="text-white/80 hover:text-white text-xs font-semibold transition-colors hidden sm:inline">Ashlovesnoodle</button>
        <button className="text-white/60 hover:text-white text-xs transition-colors hidden md:inline">Finder</button>
        <button className="text-white/60 hover:text-white text-xs transition-colors hidden lg:inline">Photoshop</button>
        <button className="text-white/60 hover:text-white text-xs transition-colors hidden lg:inline">Notes</button>
        <button className="text-white/60 hover:text-white text-xs transition-colors hidden xl:inline">Photos</button>
        <button className="text-white/60 hover:text-white text-xs transition-colors hidden xl:inline">Social</button>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1 lg:gap-3">
        <button
          onClick={onSpotlight}
          className="text-white/70 hover:text-white transition-colors"
        >
          <Search size={13} />
        </button>
        <Wifi size={13} className="text-white/70 hidden sm:inline" />
        <div className="flex items-center gap-1 hidden md:flex">
          <Battery size={13} className="text-white/70" />
          <span className="text-xs text-white/70">100%</span>
        </div>
        <div className="text-xs text-white/80 font-medium">
          <span className="hidden sm:inline">{formatDate(time)} </span>{formatTime(time)}
        </div>
      </div>
    </div>
  );
}
