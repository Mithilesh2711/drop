import React from 'react';
import ImageUploader from './ImageUploader';

const DocumentUploader = ({
  onUploadComplete,
  label = 'Upload Document',
  accept = 'image/*',
  maxSizeMB = 2,
  className = '',
  folder = 'documents'
}) => {
  return (
    <div className={className}>
      <ImageUploader
        onUploadComplete={onUploadComplete}
        label={label}
        accept={accept}
        maxSizeMB={maxSizeMB}
        folder={folder}
      />
      <p className="text-xs text-gray-500 mt-1">
        Recommended formats: PNG, JPEG. Max size: {maxSizeMB}MB
      </p>
    </div>
  );
};

export default DocumentUploader; 