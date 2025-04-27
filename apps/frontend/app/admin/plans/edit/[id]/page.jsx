'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const API_BASE_URL = 'http://localhost:5000';

export default function EditPlanPage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyCharge: '',
    securityDeposit: '',
    features: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/plans/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch plan');
        
        const plan = await response.json();
        setFormData({
          ...plan,
          features: plan.features.join('\n')
        });
      } catch (error) {
        toast.error('Failed to fetch plan');
        console.error('Error fetching plan:', error);
      }
    };

    fetchPlan();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const features = formData.features.split('\n').filter(f => f.trim());
      const planData = {
        ...formData,
        monthlyCharge: Number(formData.monthlyCharge),
        securityDeposit: Number(formData.securityDeposit),
        features
      };

      const response = await fetch(`${API_BASE_URL}/api/plans/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });

      if (!response.ok) throw new Error('Failed to update plan');
      
      toast.success('Plan updated successfully');
      router.push('/admin/plans');
    } catch (error) {
      toast.error('Failed to update plan');
      console.error('Error updating plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyCharge">Monthly Charge (₹)</Label>
                <Input
                  id="monthlyCharge"
                  type="number"
                  value={formData.monthlyCharge}
                  onChange={(e) => setFormData({ ...formData, monthlyCharge: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/plans')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 