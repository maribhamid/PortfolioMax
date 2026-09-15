import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { readFileAsDataUrl } from '../utils/driveHelper';

const RESUME_CACHE_KEY = 'portfolio_resume_data_cache';
let memoryCache: { dataUrl: string; fileName: string } | null = null;

// Chunk size in characters for Base64 (350,000 chars ≈ 260 KB per document, well below Firestore's 1MB limit)
const CHUNK_SIZE = 350000;

export interface ResumeUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  dataUrl: string;
}

/**
 * Save a Resume file (PDF, DOCX, TXT) to Firebase Firestore with automatic chunking.
 * Supports files up to 10 MB seamlessly.
 */
export async function saveResumeToFirestore(file: File): Promise<ResumeUploadResult> {
  const dataUrl = await readFileAsDataUrl(file);
  return saveResumeDataUrlToFirestore(dataUrl, file.name, file.size, file.type);
}

/**
 * Save a Resume Data URL directly to Firebase Firestore (useful for migrating from localStorage).
 */
export async function saveResumeDataUrlToFirestore(
  dataUrl: string,
  fileName: string,
  fileSize?: number,
  fileType?: string
): Promise<ResumeUploadResult> {
  const size = fileSize || Math.round((dataUrl.length * 3) / 4);
  const type = fileType || (dataUrl.startsWith('data:application/pdf') ? 'application/pdf' : 'application/octet-stream');

  // Cache immediately in memory and sessionStorage
  memoryCache = { dataUrl, fileName };
  try {
    sessionStorage.setItem(RESUME_CACHE_KEY, dataUrl);
  } catch {
    // sessionStorage quota exceeded or restricted; memoryCache remains
  }

  if (!db || !isFirebaseConfigured) {
    return {
      url: dataUrl,
      fileName,
      fileSize: size,
      dataUrl,
    };
  }

  const firestore = db;

  try {
    if (dataUrl.length <= CHUNK_SIZE) {
      // Small file: Single document in portfolio/resume
      await setDoc(doc(firestore, 'portfolio', 'resume'), {
        fileName,
        fileSize: size,
        fileType: type,
        chunked: false,
        totalChunks: 1,
        dataUrl,
        updatedAt: Date.now(),
      });
    } else {
      // Large file: Split into chunks
      const chunks: string[] = [];
      for (let i = 0; i < dataUrl.length; i += CHUNK_SIZE) {
        chunks.push(dataUrl.substring(i, i + CHUNK_SIZE));
      }

      // 1. Write metadata document
      await setDoc(doc(firestore, 'portfolio', 'resume'), {
        fileName,
        fileSize: size,
        fileType: type,
        chunked: true,
        totalChunks: chunks.length,
        updatedAt: Date.now(),
      });

      // 2. Write all chunks in parallel
      const chunkPromises = chunks.map((chunk, index) =>
        setDoc(doc(firestore, 'portfolio', `resume_chunk_${index}`), {
          chunkIndex: index,
          data: chunk,
          updatedAt: Date.now(),
        })
      );
      await Promise.all(chunkPromises);
    }

    return {
      url: 'firestore://resume',
      fileName,
      fileSize: size,
      dataUrl,
    };
  } catch (err) {
    console.error('Failed to save resume to Firestore:', err);
    // Fallback: return dataUrl so it can still function locally
    return {
      url: dataUrl,
      fileName,
      fileSize: size,
      dataUrl,
    };
  }
}

/**
 * Fetch the complete Resume Data URL from Firestore or cache.
 */
export async function getResumeDataUrl(preferCache = true): Promise<{ dataUrl: string; fileName: string } | null> {
  // 1. Check memory cache
  if (preferCache && memoryCache) {
    return memoryCache;
  }

  // 2. Check sessionStorage
  if (preferCache) {
    try {
      const cached = sessionStorage.getItem(RESUME_CACHE_KEY);
      if (cached) {
        memoryCache = { dataUrl: cached, fileName: 'Resume.pdf' };
        return memoryCache;
      }
    } catch {}
  }

  if (!db || !isFirebaseConfigured) {
    return memoryCache;
  }

  const firestore = db;

  try {
    const metaSnap = await getDoc(doc(firestore, 'portfolio', 'resume'));
    if (!metaSnap.exists()) {
      return null;
    }

    const meta = metaSnap.data();
    const fileName = meta.fileName || 'Resume.pdf';

    if (!meta.chunked) {
      const dataUrl = meta.dataUrl as string;
      memoryCache = { dataUrl, fileName };
      try {
        sessionStorage.setItem(RESUME_CACHE_KEY, dataUrl);
      } catch {}
      return memoryCache;
    }

    // Reassemble chunked resume
    const totalChunks = meta.totalChunks as number;
    const chunkPromises = [];
    for (let i = 0; i < totalChunks; i++) {
      chunkPromises.push(getDoc(doc(firestore, `portfolio/resume_chunk_${i}`)));
    }

    const chunkSnaps = await Promise.all(chunkPromises);
    const chunkStrings: string[] = [];
    for (const cSnap of chunkSnaps) {
      if (cSnap.exists()) {
        chunkStrings.push(cSnap.data().data || '');
      }
    }

    const fullDataUrl = chunkStrings.join('');
    memoryCache = { dataUrl: fullDataUrl, fileName };
    try {
      sessionStorage.setItem(RESUME_CACHE_KEY, fullDataUrl);
    } catch {}
    return memoryCache;
  } catch (err) {
    console.error('Failed to fetch resume from Firestore:', err);
    return memoryCache;
  }
}

/**
 * Trigger download or view of the active Resume.
 * Handles Firestore chunked references, Data URLs, Google Drive links, and standard URLs.
 */
export async function downloadOrOpenResume(
  fallbackFileName = 'Resume.pdf',
  rawUrl?: string
): Promise<boolean> {
  const urlToUse = rawUrl || 'firestore://resume';

  // If it's a standard web link or Google Drive link
  if (urlToUse.startsWith('http://') || urlToUse.startsWith('https://')) {
    window.open(urlToUse, '_blank');
    return true;
  }

  // If it's already a Data URL
  if (urlToUse.startsWith('data:')) {
    triggerBrowserDownload(urlToUse, fallbackFileName);
    return true;
  }

  // Otherwise, fetch from Firestore
  try {
    const resumeData = await getResumeDataUrl();
    if (!resumeData || !resumeData.dataUrl) {
      console.warn('No resume data found in Firestore or cache.');
      return false;
    }

    triggerBrowserDownload(resumeData.dataUrl, resumeData.fileName || fallbackFileName);
    return true;
  } catch (err) {
    console.error('Failed to download resume:', err);
    return false;
  }
}

/**
 * Internal helper to trigger direct file download from a Data URL using an offscreen Blob link.
 */
function triggerBrowserDownload(dataUrl: string, fileName: string) {
  try {
    // Split into mime and base64 parts
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.warn('Blob download failed, falling back to direct window open:', err);
    window.open(dataUrl, '_blank');
  }
}

/**
 * Remove Resume and all associated chunks from Firestore.
 */
export async function deleteResumeFromFirestore(): Promise<void> {
  memoryCache = null;
  try {
    sessionStorage.removeItem(RESUME_CACHE_KEY);
  } catch {}

  if (!db || !isFirebaseConfigured) return;

  const firestore = db;

  try {
    const metaSnap = await getDoc(doc(firestore, 'portfolio', 'resume'));
    if (metaSnap.exists()) {
      const meta = metaSnap.data();
      if (meta.chunked && meta.totalChunks) {
        const deletePromises = [];
        for (let i = 0; i < meta.totalChunks; i++) {
          deletePromises.push(deleteDoc(doc(firestore, 'portfolio', `resume_chunk_${i}`)));
        }
        await Promise.all(deletePromises);
      }
      await deleteDoc(doc(firestore, 'portfolio', 'resume'));
    }
  } catch (err) {
    console.error('Failed to delete resume from Firestore:', err);
  }
}
