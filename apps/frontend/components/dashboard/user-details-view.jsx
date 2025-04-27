"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

const API_BASE_URL = 'http://localhost:5000';

export function UserDetailsView() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params?.id) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user with ID:', params.id);
        const response = await fetch(`${API_BASE_URL}/api/users/${params.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user details');
        }
        
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id]);

  const renderDocumentPreview = (documentUrl, title) => {
    if (!documentUrl) {
      return <p className="text-gray-500">Not uploaded</p>;
    }

    return (
      <div className="mt-2">
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <Image
            src={documentUrl}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(documentUrl, '_blank')}
          >
            View Full Size
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <Button 
            variant="outline" 
            size="default" 
            className="min-w-[120px]"
            onClick={() => router.push('/dashboard/users')}
          >
            Back to Users
          </Button>
        </div>
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">User ID: {params?.id}</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-500">User Not Found</h2>
          <Button 
            variant="outline" 
            size="default" 
            className="min-w-[120px]"
            onClick={() => router.push('/dashboard/users')}
          >
            Back to Users
          </Button>
        </div>
        <Card className="p-6 border-gray-200 bg-gray-50">
          <p>The requested user could not be found.</p>
          <p className="text-sm text-gray-500 mt-2">User ID: {params?.id}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/users')}
        >
          Back to Users
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-gray-700">{user.name}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-gray-700">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Mobile</Label>
                <p className="text-gray-700">{user.mobile}</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-gray-700">{user.role}</p>
              </div>
              <div className="space-y-2">
                <Label>Customer ID</Label>
                <p className="text-gray-700">{user.customerId || 'Not assigned'}</p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <p className="text-gray-700">{user.status || 'Active'}</p>
              </div>
              <div className="space-y-2">
                <Label>Father/Spouse Name</Label>
                <p className="text-gray-700">{user.fatherSpouseName || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Alternate Contact</Label>
                <p className="text-gray-700">{user.alternateContact || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Information Tab */}
        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Address</Label>
                <p className="text-gray-700">{user.address}</p>
              </div>
              <div className="space-y-2">
                <Label>Landmark</Label>
                <p className="text-gray-700">{user.landmark || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <p className="text-gray-700">{user.pincode}</p>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <p className="text-gray-700">{user.city}</p>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <p className="text-gray-700">{user.state}</p>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <p className="text-gray-700">{user.district}</p>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <p className="text-gray-700">{user.country || 'India'}</p>
              </div>
              <div className="space-y-2">
                <Label>Coordinates</Label>
                <p className="text-gray-700">
                  {user.latitude && user.longitude 
                    ? `${user.latitude}, ${user.longitude}`
                    : 'Not provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installation Details Tab */}
        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle>Installation Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Model Installed</Label>
                <p className="text-gray-700">{user.modelInstalled || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Serial Number</Label>
                <p className="text-gray-700">{user.serialNumber || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Flow Sensor ID</Label>
                <p className="text-gray-700">{user.flowSensorId || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>TDS Level (Before)</Label>
                <p className="text-gray-700">{user.tdsBefore || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>TDS Level (After)</Label>
                <p className="text-gray-700">{user.tdsAfter || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Installer Name</Label>
                <p className="text-gray-700">{user.installerName || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <Label>Installer Contact</Label>
                <p className="text-gray-700">{user.installerContact || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Aadhaar Card */}
              <div className="space-y-2">
                <Label>Aadhaar Card</Label>
                {renderDocumentPreview(user.aadhaarCard, 'Aadhaar Card')}
              </div>

              {/* Customer Signature */}
              <div className="space-y-2">
                <Label>Customer Signature</Label>
                {renderDocumentPreview(user.customerSignature, 'Customer Signature')}
              </div>

              {/* Installer Signature */}
              <div className="space-y-2">
                <Label>Installer Signature</Label>
                {renderDocumentPreview(user.installerSignature, 'Installer Signature')}
              </div>

              {/* Aadhaar Front */}
              <div className="space-y-2">
                <Label>Aadhaar Card Front</Label>
                {renderDocumentPreview(user.aadhaarFront, 'Aadhaar Card Front')}
              </div>

              {/* Aadhaar Back */}
              <div className="space-y-2">
                <Label>Aadhaar Card Back</Label>
                {renderDocumentPreview(user.aadhaarBack, 'Aadhaar Card Back')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 