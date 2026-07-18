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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleLoadedMetadata = () => {
      // seek to specified time, or start if not provided
      video.currentTime = seekToTime ?? 0;
    };

    const handleSeeked = () => {
      // Draw frame to canvas
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setThumbnail(dataUrl);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    // Load video (sanitize URL to handle spaces/special chars)
    video.src = encodeURI(src);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src, seekToTime]);

  return (
    <>
      {/* Hidden video and canvas for processing */}
      <video ref={videoRef} className="hidden" preload="metadata" crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="hidden" />
      
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
