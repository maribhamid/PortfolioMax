/**
 * Client-side image compression & optimization utility.
 * Downscales high-resolution camera photos down to crisp, lightweight web images
 * so they instantly fit inside Firestore (< 1MB document limit) and load fast on mobile.
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

  return new Promise((resolve, reject) => {
    // If it's an SVG, we don't need raster canvas compression
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
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
          resolve(e.target?.result as string);
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
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export function getDataUrlSizeKB(dataUrl: string): number {
  if (!dataUrl || !dataUrl.startsWith('data:')) return 0;
  // Base64 size formula: (length * 3 / 4) / 1024
  const padding = (dataUrl.endsWith('==') ? 2 : dataUrl.endsWith('=') ? 1 : 0);
  const base64Length = dataUrl.split(',')[1]?.length || 0;
  return Math.round(((base64Length * 3) / 4 - padding) / 1024);
}
