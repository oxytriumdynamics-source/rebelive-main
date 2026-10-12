/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-Side Image Compression Utility
 * ─────────────────────────────────────────────────────────────────────────────
 * Downscales and compresses large camera/raw image files in the browser before
 * uploading to Cloudinary. Ensures fast uploads and efficient CDN delivery.
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.85)
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Compresses an image file using browser Canvas API before Cloudinary upload.
 * If the file is an SVG or already smaller than 80KB, compression is safely bypassed.
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.85,
    format = 'image/webp',
  } = options;

  const originalSize = file.size;

  // Don't modify SVGs (preserve vector quality)
  if (file.type === 'image/svg+xml') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      width: 0,
      height: 0,
    };
  }

  // If already tiny (< 80KB) and correct format, return as-is
  if (originalSize < 80 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      width: 0,
      height: 0,
    };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate constrained dimensions
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
        // Fallback to original file if canvas not supported
        return resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          savedPercent: 0,
          width: img.width,
          height: img.height,
        });
      }

      // Smooth interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export canvas to target compressed format (WebP by default)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= originalSize) {
            // If compression didn't save bytes, keep original
            return resolve({
              file,
              originalSize,
              compressedSize: originalSize,
              savedPercent: 0,
              width,
              height,
            });
          }

          // Generate clean filename with appropriate extension
          const originalName = file.name.replace(/\.[^/.]+$/, '');
          const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
          const newFileName = `${originalName}.${ext}`;

          const compressedFile = new File([blob], newFileName, {
            type: blob.type || format,
            lastModified: Date.now(),
          });

          const savedPercent = Math.max(
            0,
            Math.round(((originalSize - compressedFile.size) / originalSize) * 100)
          );

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
            savedPercent,
            width,
            height,
          });
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to original
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savedPercent: 0,
        width: 0,
        height: 0,
      });
    };

    img.src = objectUrl;
  });
}
