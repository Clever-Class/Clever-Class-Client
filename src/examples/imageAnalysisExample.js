/**
 * Example demonstrating how to use the image analysis feature with the chatService
 * 
 * This example shows how to:
 * 1. Select an image from the user's device
 * 2. Compress it (similar to what the Chatbot component does)
 * 3. Send it to the API along with a text prompt (will use GPT-4-vision-preview)
 * 4. Display the AI's response
 */

import { chatService } from '../services/chatService';

// Image compression function (same as in Chatbot.tsx)
const compressImage = (
  imageDataUrl,
  maxWidth = 800,
  quality = 0.7,
) => {
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

/**
 * Process an image file for analysis
 * @param {File} file - The image file to process
 * @param {string} promptText - The text prompt to send with the image
 * @returns {Promise<string>} - The AI's response
 */
async function analyzeImage(file, promptText) {
  try {
    // Read the file as a data URL
    const reader = new FileReader();

    const fileDataPromise = new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });

    const imageData = await fileDataPromise;

    // Compress the image
    console.log('Compressing image...');
    const compressedImage = await compressImage(imageData, 800, 0.7);
    console.log('Image compressed successfully');

    // Send the image and text to the API
    console.log('Sending to API...');
    const response = await chatService.chatWithAI(
      promptText,
      undefined, // No conversation ID for a new conversation
      compressedImage // The compressed image data
    );

    return response.response;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

/**
 * Example usage in a React component:
 * 
 * function ImageAnalysisComponent() {
 *   const [selectedFile, setSelectedFile] = useState(null);
 *   const [prompt, setPrompt] = useState('What can you tell me about this image?');
 *   const [response, setResponse] = useState('');
 *   const [loading, setLoading] = useState(false);
 * 
 *   const handleFileChange = (e) => {
 *     setSelectedFile(e.target.files[0]);
 *   };
 * 
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     if (!selectedFile) return;
 *     
 *     setLoading(true);
 *     try {
 *       const result = await analyzeImage(selectedFile, prompt);
 *       setResponse(result);
 *     } catch (error) {
 *       console.error(error);
 *       setResponse('Error analyzing image. Please try again.');
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <h2>Image Analysis Example</h2>
 *       <form onSubmit={handleSubmit}>
 *         <div>
 *           <label htmlFor="image-upload">Select an image:</label>
 *           <input 
 *             type="file" 
 *             id="image-upload" 
 *             accept="image/*" 
 *             onChange={handleFileChange} 
 *           />
 *         </div>
 *         <div>
 *           <label htmlFor="prompt">Prompt:</label>
 *           <input
 *             type="text"
 *             id="prompt"
 *             value={prompt}
 *             onChange={(e) => setPrompt(e.target.value)}
 *           />
 *         </div>
 *         <button type="submit" disabled={!selectedFile || loading}>
 *           {loading ? 'Analyzing...' : 'Analyze Image'}
 *         </button>
 *       </form>
 *       {response && (
 *         <div>
 *           <h3>AI Response:</h3>
 *           <p>{response}</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */

export { analyzeImage, compressImage }; 