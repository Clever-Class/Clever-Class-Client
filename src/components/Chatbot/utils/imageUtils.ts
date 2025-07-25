/**
 * Image utility functions for the chatbot
 */

/**
 * Compresses an image and returns a data URL with reduced size
 * @param imageDataUrl - The original image data URL
 * @param maxWidth - Maximum width for the compressed image
 * @param quality - Compression quality (0-1)
 * @returns Promise with compressed image data URL
 */
export const compressImage = (
  imageDataUrl: string,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageDataUrl;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to compressed data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};
