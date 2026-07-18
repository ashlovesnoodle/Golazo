import { useState, useRef, useEffect } from 'react';

interface VideoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  seekToTime?: number; // seek to this time (in seconds) to capture frame (optional)
}

export default function VideoThumbnail({ src, alt, className = '', seekToTime }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    const handleLoadedMetadata = () => {
      video.currentTime = seekToTime ?? 0;
    };

    const handleSeeked = () => {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setThumbnail(dataUrl);
      setIsLoading(false);
    };

    // Only load video when component is visible
    if (!isVisible) return;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    video.src = encodeURI(src);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src, seekToTime, isVisible]);


  // Intersection observer to set visibility
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
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
    return () => obs.disconnect();
  }, []);
  return (
    <>
      {/* Hidden video and canvas for processing */}
      <div ref={wrapperRef} className="hidden">
        <video ref={videoRef} className="hidden" preload="metadata" crossOrigin="anonymous" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Display thumbnail or loading state */}
      {isLoading ? (
        <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : thumbnail ? (
        <img src={thumbnail} alt={alt} className={className} />
      ) : (
        <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
          <span className="text-white/50 text-xs">Video</span>
        </div>
      )}
    </>
  );
}
