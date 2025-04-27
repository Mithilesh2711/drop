import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createImagePreviewUrl, revokeImagePreviewUrl } from '../../utils/fileUploadUtils';

const ImageUploader = ({
  onUploadComplete,
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 5,
  className = '',
  folder = 'uploads'
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImagePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      
      // Create preview URL
      const previewUrl = createImagePreviewUrl(selectedFile);
      setPreviewUrl(previewUrl);
      setFile(selectedFile);

      // Call the callback with the file info
      onUploadComplete({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        previewUrl: previewUrl,
        file: selectedFile // Store the file object
      });

      toast.success('File selected successfully');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
      setPreviewUrl(null);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      revokeImagePreviewUrl(previewUrl);
      setPreviewUrl(null);
    }
    setFile(null);
    onUploadComplete(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs rounded-lg shadow-sm"
          />
        </div>
      )}
      {isUploading && (
        <div className="text-sm text-gray-500">
          Processing...
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 