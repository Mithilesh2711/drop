import { toast } from 'sonner';

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {string} - The preview URL
 */
export const createImagePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free up memory
 * @param {string} previewUrl - The preview URL to revoke
 */
export const revokeImagePreviewUrl = (previewUrl) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};

/**
 * Validates a file's size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {boolean} - Whether the file is valid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast.error(`File size exceeds ${maxSizeMB}MB limit`);
    return false;
  }
  return true;
};

/**
 * Processes a file and returns file information
 * @param {File} file - The file to process
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {Promise<{fileName: string, fileType: string, fileSize: number, previewUrl: string}>}
 */
export const processFile = async (file, maxSizeMB = 5) => {
  // Check file size
  if (!validateFileSize(file, maxSizeMB)) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  try {
    // Create preview URL
    const previewUrl = createImagePreviewUrl(file);
    
    // Return the file info
    return {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      previewUrl: previewUrl
    };
  } catch (error) {
    console.error('Error processing file:', error);
    toast.error('Failed to process file. Please try again.');
    throw error;
  }
}; 