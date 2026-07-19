import { useState, useRef, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface VideoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  seekToTime?: number; // seek to this time (in seconds) to capture frame (optional)
}

const createPlaceholderThumbnail = (label: string) => {
  const safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
      <rect width="320" height="240" rx="24" fill="#111827"/>
      <rect x="16" y="16" width="288" height="208" rx="20" fill="url(#grad)"/>
      <circle cx="160" cy="120" r="42" fill="rgba(255,255,255,0.18)"/>
      <path d="M146 96l36 24-36 24z" fill="white"/>
      <text x="160" y="188" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)">${safeLabel}</text>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function VideoThumbnail({ src, alt, className = '', seekToTime }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let settled = false;

    const captureFrame = () => {
      try {
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnail(dataUrl);
        setIsLoading(false);
        setHasFailed(false);
        settled = true;
      } catch (err) {
        // Drawing may fail if video not ready or cross-origin; we'll ignore and let fallbacks run
      }
    };

    const handleLoadedMetadata = () => {
      // ensure we can seek to a proper time
      try {
        const targetTime = typeof seekToTime === 'number' ? seekToTime : 0;
        if (Number.isFinite(targetTime) && targetTime >= 0) {
          video.currentTime = Math.min(targetTime, (video.duration || targetTime));
        }
      } catch {}
    };

    const handleSeeked = () => {
      if (!settled) captureFrame();
    };

    const handleLoadedData = () => {
      // try capturing without seeking if seek didn't happen
      if (!settled) captureFrame();
    };

    const handleError = () => {
      setHasFailed(true);
      setIsLoading(false);
      settled = true;
    };

    if (!isVisible) return;

    setThumbnail(null);
    setIsLoading(true);
    setHasFailed(false);

    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');

    const fallbackTimer = window.setTimeout(() => {
      if (!settled) {
        // try one last attempt to capture
        try {
          captureFrame();
        } catch {}
      }
      if (!settled) {
        setHasFailed(true);
        setIsLoading(false);
      }
    }, 3500);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // set source and load
    video.src = encodeURI(src);
    // try to load and play briefly to ensure frames are available for some browsers
    try {
      video.load();
    } catch {}

    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [src, seekToTime, isVisible]);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    obs.observe(node);

    const fallbackObserverTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      window.clearTimeout(fallbackObserverTimer);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={wrapperRef} className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none">
        <video ref={videoRef} preload="metadata" crossOrigin="anonymous" />
        <canvas ref={canvasRef} />
      </div>

      {isLoading ? (
        <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : thumbnail ? (
        <OptimizedImage src={thumbnail} alt={alt} className={className} priority="high" />
      ) : (
        <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
          <img
            src={createPlaceholderThumbnail(alt || 'Video')}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </>
  );
}
