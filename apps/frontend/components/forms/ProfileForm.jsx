import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import ImageUploader from '../ui/ImageUploader';
import SignatureUploader from '../ui/SignatureUploader';
import DocumentUploader from '../ui/DocumentUploader';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: null,
    signature: null,
    documents: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageUpload = (fileInfo) => {
    setFormData(prev => ({
      ...prev,
      profileImage: {
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
        base64Data: fileInfo.base64Data
      }
    }));
  };

  const handleSignatureUpload = (fileInfo) => {
    setFormData(prev => ({
      ...prev,
      signature: {
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
        base64Data: fileInfo.base64Data
      }
    }));
  };

  const handleDocumentUpload = (fileInfo) => {
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          fileName: fileInfo.fileName,
          fileType: fileInfo.fileType,
          fileSize: fileInfo.fileSize,
          base64Data: fileInfo.base64Data
        }
      ]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data to send to server
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: formData.profileImage?.base64Data || null,
        signature: formData.signature?.base64Data || null,
        documents: formData.documents.map(doc => doc.base64Data)
      };

      // Send data to server
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Profile Image</h3>
        <ImageUploader
          onUploadComplete={handleProfileImageUpload}
          label="Upload Profile Image"
          accept="image/*"
          maxSizeMB={2}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Signature</h3>
        <SignatureUploader
          onUploadComplete={handleSignatureUpload}
        />
      </div>

      <div className="space-y-2">
        <Label>Documents</Label>
        <DocumentUploader
          onUploadComplete={handleDocumentUpload}
        />
        {formData.documents.length > 0 && (
          <ul className="mt-2 space-y-1">
            {formData.documents.map((doc, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="truncate">{doc.fileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Saving...</span>
          </div>
        ) : (
          'Save Profile'
        )}
      </Button>
    </form>
  );
};

export default ProfileForm; 