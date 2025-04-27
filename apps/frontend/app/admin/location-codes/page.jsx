'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';

// API base URL - change this to match your backend server
const API_BASE_URL = 'http://localhost:5000/api';

export default function LocationCodesAdmin() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    pincode: '',
    state: '',
    district: '',
    city: '',
    districtCode: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/location-codes`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch locations' }));
        throw new Error(errorData.message || 'Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error(error.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      pincode: '',
      state: '',
      district: '',
      city: '',
      districtCode: ''
    });
    setIsEditing(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.pincode || !formData.state || !formData.district || !formData.city || !formData.districtCode) {
      toast.error('All fields are required');
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/location-codes/admin/locations`;
      const method = editingLocation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to ${editingLocation ? 'update' : 'add'} location` }));
        throw new Error(errorData.message || `Failed to ${editingLocation ? 'update' : 'add'} location`);
      }
      
      toast.success(`Location ${editingLocation ? 'updated' : 'added'} successfully`);
      resetForm();
      fetchLocations();
    } catch (error) {
      console.error(`Error ${editingLocation ? 'updating' : 'adding'} location:`, error);
      toast.error(error.message || `Failed to ${editingLocation ? 'update' : 'add'} location`);
    }
  };

  const handleEdit = (location) => {
    setFormData({
      pincode: location.pincode,
      state: location.state,
      district: location.district,
      city: location.city,
      districtCode: location.districtCode
    });
    setIsEditing(true);
    setEditingLocation(location);
  };

  const handleDelete = async (pincode) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/location-codes/admin/locations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete location' }));
        throw new Error(errorData.message || 'Failed to delete location');
      }
      
      toast.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error(error.message || 'Failed to delete location');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Location Codes Management</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Location
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    disabled={editingLocation}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">District</label>
                  <Input
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Enter district"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">District Code</label>
                  <Input
                    name="districtCode"
                    value={formData.districtCode}
                    onChange={handleInputChange}
                    placeholder="Enter district code"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingLocation ? 'Update Location' : 'Add Location'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pincode</TableHead>
                <TableHead>State</TableHead>
                <TableHead>District</TableHead>
                <TableHead>City</TableHead>
                <TableHead>District Code</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.pincode}>
                  <TableCell>{location.pincode}</TableCell>
                  <TableCell>{location.state}</TableCell>
                  <TableCell>{location.district}</TableCell>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.districtCode}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(location)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(location.pincode)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 