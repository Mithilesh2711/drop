'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Printer, MessageSquare } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

export default function TransactionDetailsPage({ params }) {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/transactions/${params.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to fetch transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = () => {
    window.open(`/receipt?id=${transaction._id}`, '_blank');
  };

  const handleSendWhatsApp = () => {
    let receiptUrl = `${FRONTEND_URL}/receipt?id=${transaction._id}`;
    // Ensure URL has protocol
    if (!receiptUrl.startsWith('http://') && !receiptUrl.startsWith('https://')) {
      receiptUrl = `http://${receiptUrl}`;
    }
    const message = `Dear ${transaction.name},\n\nThank you for your payment of ₹${transaction.totalPaidAmount} for ${transaction.planName}.\n\nView/Print your receipt here:\n\n` +
      `${receiptUrl}\n\n` +
      `Payment Details:\n` +
      `Date: ${new Date(transaction.date).toLocaleDateString()}\n` +
      `Mode: ${transaction.paymentDetails.paymentMode}\n\n` +
      `Thank you for your business!`;

    const whatsappUrl = `https://wa.me/${transaction.mobile}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Transaction not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/dashboard/transactions')}
        >
          Back to Transactions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/transactions')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleViewReceipt}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Receipt
          </Button>
          <Button
            variant="outline"
            onClick={handleSendWhatsApp}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p>{formatDate(transaction.date)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Customer ID</h3>
            <p>{transaction.customerId}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p>{transaction.name}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
            <p>{transaction.mobile}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p>{transaction.email || '-'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Plan Name</h3>
            <p>{transaction.planName}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Amount Paid</h3>
              <p className="text-lg font-semibold">{formatAmount(transaction.totalPaidAmount)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Amount Payable</h3>
              <p className="text-lg font-semibold">{formatAmount(transaction.totalPayableAmount)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Payment Mode</h3>
              <p>{transaction.paymentDetails?.paymentMode || '-'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Reference Number</h3>
              <p>{transaction.paymentDetails?.refNo || '-'}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Receipt Items</h2>
          <div className="space-y-4">
            {transaction.receipt && transaction.receipt.length > 0 ? (
              <div className="border rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.receipt.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.headName}</td>
                        <td className="text-right py-2">{formatAmount(item.headAmount)}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="py-2">Total Amount</td>
                      <td className="text-right py-2">{formatAmount(transaction.totalPaidAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No receipt items found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 