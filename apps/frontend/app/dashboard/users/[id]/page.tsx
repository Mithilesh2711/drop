"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import Image from 'next/image';
import type { User } from '@/types/user';
import Link from 'next/link';
import { API_BASE_URL, FRONTEND_URL } from '@/config';



// --- UserTransactions component ---
function UserTransactions({ userId, user }: { userId: string; user: User }) {
  interface Transaction {
    _id: string;
    date: string;
    name: string;
    mobile: string;
    planName: string;
    totalPaidAmount: number;
    totalPayableAmount: number;
    paymentDetails: {
      paymentMode: string;
      refNo?: string;
    };
    receipt: Array<{
      headName: string;
      headAmount: number;
    }>;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/user/${userId}`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      console.log('Transactions data:', data);
      setTransactions(data);
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchTransactions();
  }, [userId]);

  const handleViewReceipt = (transaction: Transaction) => {
    window.open(`/receipt?id=${transaction._id}`, '_blank');
  };

  const handleSendWhatsApp = (transaction: Transaction) => {
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



  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Link href={`/dashboard/transactions/add?userId=${userId}`}>
          <Button>
            Add Transaction
          </Button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Payment Mode</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="p-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{transaction.planName}</td>
                  <td className="p-2">
                    <div>₹{transaction.totalPaidAmount}</div>
                    {transaction.totalPayableAmount > transaction.totalPaidAmount && (
                      <div className="text-sm text-red-500">
                        Due: ₹{transaction.totalPayableAmount - transaction.totalPaidAmount}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {transaction.paymentDetails.paymentMode}
                    {transaction.paymentDetails.refNo && (
                      <div className="text-sm text-gray-500">
                        Ref: {transaction.paymentDetails.refNo}
                      </div>
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReceipt(transaction)}
                    >
                      Receipt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(transaction)}
                    >
                      WhatsApp
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Main UserDetailsPage component ---
export default function UserDetails({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${params.id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id]);

  const renderDocumentPreview = (documentUrl: string | undefined, title: string) => {
    if (!documentUrl) {
      return <p className="text-gray-500">Not uploaded</p>;
    }

    // Log the URL for debugging
    console.log(`Rendering ${title} with URL:`, documentUrl);

    return (
      <div className="mt-2">
        <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={documentUrl}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.error(`Error loading ${title}:`, e);
              // Fallback to a direct img tag if Next.js Image fails
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = documentUrl;
              imgElement.style.objectFit = 'contain';
            }}
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="transactions">Transaction</TabsTrigger>
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
              {/* Aadhaar Front */}
              <div className="space-y-2">
                <Label>Aadhaar Card Front</Label>
                {renderDocumentPreview(user.aadhaarFrontImage, 'Aadhaar Card Front')}
              </div>

              {/* Aadhaar Back */}
              <div className="space-y-2">
                <Label>Aadhaar Card Back</Label>
                {renderDocumentPreview(user.aadhaarBackImage, 'Aadhaar Card Back')}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <UserTransactions userId={params.id} user={user} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}