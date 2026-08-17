import React, { useEffect, useState } from 'react';

// Global in-memory cache to prevent re-processing canvas pixels on re-renders/scrolls
const logoMemoryCache = new Map();

export default function TransparentLogo({ src = '/logo.png', alt = '', tolerance = 40, className = '', width, height }) {
  const cacheKey = `${src}_${tolerance}`;
  const [dataUrl, setDataUrl] = useState(() => logoMemoryCache.get(cacheKey) || null);

  useEffect(() => {
    if (logoMemoryCache.has(cacheKey)) {
      setDataUrl(logoMemoryCache.get(cacheKey));
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const im = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = im.data;
        const tol2 = tolerance * tolerance;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist2 = r * r + g * g + b * b;
          if (dist2 <= tol2) {
            data[i + 3] = 0; // transparent
          }
        }
        ctx.putImageData(im, 0, 0);
        const out = canvas.toDataURL('image/png');
        logoMemoryCache.set(cacheKey, out);
        setDataUrl(out);
      } catch (err) {
        logoMemoryCache.set(cacheKey, src);
        setDataUrl(src);
      }
    };
    img.onerror = () => {
      logoMemoryCache.set(cacheKey, src);
      setDataUrl(src);
    };
    return () => { cancelled = true; };
  }, [src, tolerance, cacheKey]);

  return (
    <img
      src={dataUrl || src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="eager"
      decoding="async"
    />
  );
}

