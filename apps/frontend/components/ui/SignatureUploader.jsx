import React from 'react';
import ImageUploader from './ImageUploader';

const SignatureUploader = ({ 
  onUploadComplete, 
  className = "" 
}) => {
  return (
    <div className={className}>
      <ImageUploader
        onUploadComplete={onUploadComplete}
        label="Upload Signature"
        accept="image/png,image/jpeg,image/jpg"
        maxSizeMB={2}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground mt-1 text-center">
        Recommended: PNG or JPEG format, max 2MB
      </p>
    </div>
  );
};

export default SignatureUploader; 