import { useEffect, useRef, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  priority?: 'high' | 'low';
}

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  priority = 'low',
  onLoad,
  style,
  ...props
}: OptimizedImageProps) {
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority === 'high' || !imgRef.current) {
      setShouldLoad(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const node = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '250px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <img
      {...props}
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      alt={alt}
      className={className}
      loading={priority === 'high' ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        ...style,
        opacity: shouldLoad && isLoaded ? 1 : 0,
        transition: 'opacity 180ms ease-out',
      }}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}
