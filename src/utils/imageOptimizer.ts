/**
 * Client-Side Image Optimizer and Compressor
 * Automatically scales down large photos (e.g. 5-25MB camera uploads) to crisp,
 * web-optimized images (max 1920x1080, ~150-300KB) before saving/uploading.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export async function optimizeImageFile(
  file: File | Blob,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    mimeType = 'image/webp'
  } = options;

  // If it is SVG, read directly as text/dataURL to maintain vector quality
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data URL if image rendering fails
        resolve(e.target?.result as string);
      };
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // If image is already reasonably sized, maintain dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Try exporting to WebP first, fallback to JPEG if unsupported
          let optimizedDataUrl: string;
          try {
            optimizedDataUrl = canvas.toDataURL(mimeType, quality);
            // If browser doesn't support target mimeType it returns image/png
            if (mimeType === 'image/webp' && !optimizedDataUrl.startsWith('data:image/webp')) {
              optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(optimizedDataUrl);
        } catch {
          // Fallback to raw data URL
          resolve(e.target?.result as string);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
