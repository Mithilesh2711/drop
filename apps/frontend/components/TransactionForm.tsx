'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_BASE_URL } from '@/config';
import { toast } from '@/components/ui/use-toast';

interface TransactionFormProps {
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentMode = 'cash' | 'upi' | 'card' | 'netbanking';

interface FormData {
  planName: string;
  totalPaidAmount: string;
  paymentMode: PaymentMode;
  refNo: string;
}

export function TransactionForm({
  customerId,
  customerName,
  customerMobile,
  customerEmail,
  onSuccess,
  onCancel
}: TransactionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    planName: '',
    totalPaidAmount: '',
    paymentMode: 'cash',
    refNo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.planName || !formData.totalPaidAmount) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          name: customerName,
          mobile: customerMobile,
          email: customerEmail,
          planName: formData.planName,
          totalPaidAmount: parseFloat(formData.totalPaidAmount),
          paymentDetails: {
            paymentMode: formData.paymentMode,
            refNo: formData.refNo
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction created successfully",
        });
        onSuccess();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || 'Failed to create transaction',
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create transaction',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="planName">Plan Name</Label>
        <Input
          id="planName"
          value={formData.planName}
          onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.totalPaidAmount}
          onChange={(e) => setFormData({ ...formData, totalPaidAmount: e.target.value })}
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMode">Payment Mode</Label>
        <select
          id="paymentMode"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.paymentMode}
          onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as PaymentMode })}
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="netbanking">Net Banking</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="refNo">Reference Number</Label>
        <Input
          id="refNo"
          value={formData.refNo}
          onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
          className="w-full"
          placeholder="Optional for cash payments"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Transaction
        </Button>
      </div>
    </form>
  );
}
