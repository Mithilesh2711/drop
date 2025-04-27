"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export default function PrintableReceipt() {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      setLoading(false);
      return;
    }
    
    const id = searchParams.get('id');
    if (!id) {
      setLoading(false);
      return;
    }

    // Use the public receipt endpoint
    fetch(`${API_BASE_URL}/api/transactions/receipt/${id}`)
      .then(res => res.json())
      .then(data => {
        setTransaction(data);
        // Auto-trigger print when transaction is loaded
        setTimeout(() => {
          window.print();
        }, 500);
      })
      .catch(error => {
        console.error('Error fetching receipt:', error);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading receipt...</div>;
  if (!transaction) return <div className="min-h-screen flex items-center justify-center">Receipt not found.</div>;

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <div className="max-w-2xl mx-auto bg-white print:shadow-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">DROP</h1>
          <p className="text-sm text-gray-600">Receipt #{transaction._id}</p>
          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className="font-medium">Name:</span> {transaction.name}</p>
                <p><span className="font-medium">Mobile:</span> {transaction.mobile}</p>
                {transaction.email && (
                  <p><span className="font-medium">Email:</span> {transaction.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className="font-medium">Plan:</span> {transaction.planName}</p>
                <p><span className="font-medium">Payment Mode:</span> {transaction.paymentDetails.paymentMode}</p>
                {transaction.paymentDetails.refNo && (
                  <p><span className="font-medium">Reference No:</span> {transaction.paymentDetails.refNo}</p>
                )}
              </div>
            </div>
          </div>

          {transaction.receipt && transaction.receipt.length > 0 && (
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Receipt Details</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.receipt.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.headName}</td>
                      <td className="text-right py-2">₹{item.headAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-right border-b pb-4">
            <div className="text-lg">
              <span className="font-medium">Total Amount Paid:</span>
              <span className="ml-4 font-bold">₹{transaction.totalPaidAmount}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-8 pt-4">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p className="mt-1">For any queries, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
