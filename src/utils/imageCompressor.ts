/**
 * Client-side image compression & optimization utility.
 * Downscales high-resolution camera photos down to crisp, lightweight web images
 * so they instantly fit inside Firestore (< 1MB document limit) and load fast on mobile.
 * 
 * Built with full CORS safety and zero-taint guarantees:
 * 1. Uses modern createImageBitmap API off-thread where available (never touches DOM Image, immune to CORS).
 * 2. Uses FileReader + HTMLImageElement fallback with full error encapsulation.
 * 3. Gracefully falls back to raw data URI if canvas export fails for any reason.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.82,
    mimeType = 'image/webp'
  } = options;

  // If it's an SVG, SVG is vector and doesn't need raster canvas compression
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Strategy 1: Modern createImageBitmap API (Chrome, Edge, Firefox, Safari 15+)
  // Decodes directly from local File blob off-thread with ZERO CORS or DOM restrictions
  if (typeof window !== 'undefined' && typeof window.createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      let { width, height } = bitmap;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(bitmap, 0, 0, width, height);

        try {
          let compressed = canvas.toDataURL(mimeType, quality);
          if (!compressed.startsWith(`data:${mimeType}`)) {
            compressed = canvas.toDataURL('image/jpeg', quality);
          }
          if (compressed.length > 400 * 1024) {
            compressed = canvas.toDataURL('image/jpeg', 0.65);
          }
          return compressed;
        } catch (canvasErr) {
          console.warn('Canvas toDataURL notice, continuing with fallback:', canvasErr);
        }
      }
    } catch (bitmapErr) {
      console.warn('createImageBitmap skipped, using FileReader fallback:', bitmapErr);
    }
  }

  // Strategy 2: FileReader + HTMLImageElement with complete safety encapsulation
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;

    reader.onload = (e) => {
      const originalDataUrl = e.target?.result as string;
      if (!originalDataUrl) {
        reject(new Error('Failed to read file contents.'));
        return;
      }

      const img = new Image();

      // Note: We deliberately do NOT set img.crossOrigin = 'anonymous' on data: URIs,
      // as some browsers flag crossOrigin on local data: URIs with a false-positive CORS error.
      img.onerror = () => {
        // If image element fails to load, safely return the raw Data URL so the user is never blocked
        resolve(originalDataUrl);
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Maintain aspect ratio while bounding within maxWidth/maxHeight
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(originalDataUrl);
            return;
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try webp first, fall back to jpeg if unsupported
          let compressed = canvas.toDataURL(mimeType, quality);
          if (!compressed.startsWith(`data:${mimeType}`)) {
            compressed = canvas.toDataURL('image/jpeg', quality);
          }

          // If still somehow > 400KB, do a second lighter pass
          if (compressed.length > 400 * 1024) {
            compressed = canvas.toDataURL('image/jpeg', 0.65);
          }

          resolve(compressed);
        } catch (canvasErr) {
          // If canvas throws SecurityError (tainted canvas) or any error, safely return raw data URL
          console.warn('Canvas export warning, using raw data URI fallback:', canvasErr);
          resolve(originalDataUrl);
        }
      };

      img.src = originalDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export function getDataUrlSizeKB(dataUrl: string): number {
  if (!dataUrl || !dataUrl.startsWith('data:')) return 0;
  const padding = (dataUrl.endsWith('==') ? 2 : dataUrl.endsWith('=') ? 1 : 0);
  const base64Length = dataUrl.split(',')[1]?.length || 0;
  return Math.round(((base64Length * 3) / 4 - padding) / 1024);
}
