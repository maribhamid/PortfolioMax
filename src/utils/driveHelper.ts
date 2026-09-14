/**
 * Utility to parse and format Google Drive links into direct, embeddable URLs.
 */
export function formatGoogleDriveUrl(url: string, type: 'image' | 'document' = 'image'): string {
  if (!url || typeof url !== 'string') return url;

  const trimmed = url.trim();

  // Check if it's a Google Drive link
  // Formats:
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const fileIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    if (type === 'image') {
      // Google User Content CDN directly serves the image without HTML wrappers
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    } else {
      // Direct downloadable or previewable document
      return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    }
  }

  return trimmed;
}

/**
 * Reads a File from local disk and returns a Promise resolving to Base64 data URI
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
