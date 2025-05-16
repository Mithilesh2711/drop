"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config";
import mongoose from "mongoose";

interface ReceiptItem {
  headName: "Security Deposit" | "Rent";
  headAmount: number;
}

interface Plan {
  _id: string;
  name: string;
  monthlyCharge: number;
  securityDeposit: number;
}

interface TransactionFormData {
  planName: string;
  totalPaidAmount: string;
  totalPayableAmount: string;
  paymentDetails: {
    paymentMode: string;
    refNo?: string;
  };
  receipt: ReceiptItem[];
  customerId: string;
  email: string;
  mobile: string;
  name: string;
}

function AddTransactionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [userDetails, setUserDetails] = useState<{ customerId: string; email: string; mobile: string; name: string } | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    planName: "",
    totalPaidAmount: "",
    totalPayableAmount: "",
    paymentDetails: {
      paymentMode: "cash",
      refNo: "",
    },
    receipt: [],
    customerId: "",
    email: "",
    mobile: "",
    name: "",
  });

  const [receiptItem, setReceiptItem] = useState<ReceiptItem>({
    headName: "Rent",
    headAmount: 0,
  });

  useEffect(() => {
    if (!userId) {
      router.push('/dashboard/users');
      return;
    }
  }, [userId, router]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        
        const data = await response.json();
        setUserDetails({
          customerId: data.customerId,
          email: data.email,
          mobile: data.mobile,
          name: data.name,
        });
        setFormData(prev => ({
          ...prev,
          customerId: data.customerId,
          email: data.email,
          mobile: data.mobile,
          name: data.name,
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user details",
        });
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/plans`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load plans. Please try again.",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleAddReceiptItem = () => {
    if (!receiptItem.headAmount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an amount for the receipt item",
      });
      return;
    }

    setFormData({
      ...formData,
      receipt: [...formData.receipt, receiptItem],
      totalPayableAmount: String(
        Number(formData.totalPayableAmount || 0) + receiptItem.headAmount
      ),
    });

    setReceiptItem({
      headName: "Rent",
      headAmount: 0,
    });
  };

  const handleRemoveReceiptItem = (index: number) => {
    const newReceipt = formData.receipt.filter((_, i) => i !== index);
    const newTotalPayable = newReceipt.reduce(
      (sum, item) => sum + item.headAmount,
      0
    );

    setFormData({
      ...formData,
      receipt: newReceipt,
      totalPayableAmount: String(newTotalPayable),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.planName ||
        !formData.totalPaidAmount ||
        formData.receipt.length === 0 ||
        !userId ||
        !formData.customerId ||
        !formData.mobile ||
        !formData.name
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      // Calculate totalPayableAmount from receipt items and round to 2 decimal places
      const totalPayableAmount = Number(
        formData.receipt
          .reduce((sum, item) => sum + item.headAmount, 0)
          .toFixed(2)
      );

      const transactionData = {
        userId: userId,
        customerId: formData.customerId,
        email: formData.email,
        mobile: formData.mobile,
        name: formData.name,
        planName: formData.planName,
        totalPaidAmount: Number(Number(formData.totalPaidAmount).toFixed(2)),
        totalPayableAmount: totalPayableAmount,
        paymentDetails: formData.paymentDetails,
        receipt: formData.receipt.map(item => ({
          headName: item.headName,
          headAmount: Number(item.headAmount.toFixed(2))
        })),
        date: new Date(),
      };

      console.log('Sending transaction data:', transactionData);

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create transaction");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      
      // Redirect to the transaction details page
      router.push(`/dashboard/transactions/${data._id}`);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create transaction",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="planName">Select Plan</Label>
                {loadingPlans ? (
                  <div className="h-10 flex items-center text-sm text-muted-foreground">
                    Loading plans...
                  </div>
                ) : (
                  <select
                    id="planName"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.planName}
                    onChange={(e) => {
                      console.log('Selected plan name:', e.target.value);
                      const selectedPlan = plans.find(p => p.name === e.target.value);
                      console.log('Found plan:', selectedPlan);
                      if (selectedPlan) {
                        // Create receipt item only for rent
                        const receiptItems: ReceiptItem[] = [
                          {
                            headName: "Rent" as const,
                            headAmount: selectedPlan.monthlyCharge
                          }
                        ];
                        
                        setFormData({
                          ...formData,
                          planName: selectedPlan.name,
                          totalPayableAmount: String(selectedPlan.monthlyCharge),
                          receipt: receiptItems
                        });
                      }
                    }}
                    required
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan.name}>
                        {plan.name} - ₹{plan.monthlyCharge}/month
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <Label htmlFor="totalPaidAmount">Total Paid Amount</Label>
                <Input
                  id="totalPaidAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalPaidAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, totalPaidAmount: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Payment Mode</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.paymentDetails.paymentMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentDetails: {
                        ...formData.paymentDetails,
                        paymentMode: e.target.value,
                      },
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>

              {formData.paymentDetails.paymentMode !== "cash" && (
                <div>
                  <Label htmlFor="refNo">Reference Number</Label>
                  <Input
                    id="refNo"
                    value={formData.paymentDetails.refNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentDetails: {
                          ...formData.paymentDetails,
                          refNo: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
              )}

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-semibold">Receipt Items</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="headName">Type</Label>
                      <select
                        id="headName"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={receiptItem.headName}
                        onChange={(e) =>
                          setReceiptItem({
                            ...receiptItem,
                            headName: e.target.value as "Security Deposit" | "Rent",
                          })
                        }
                      >
                        <option value="Rent">Rent</option>
                        <option value="Security Deposit">Security Deposit</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="headAmount">Amount</Label>
                      <Input
                        id="headAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={receiptItem.headAmount || ""}
                        onChange={(e) =>
                          setReceiptItem({
                            ...receiptItem,
                            headAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={handleAddReceiptItem}
                        className="mb-0.5"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {formData.receipt.length > 0 && (
                    <div className="mt-4">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Type</th>
                            <th className="text-left">Amount</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.receipt.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2">{item.headName}</td>
                              <td className="py-2">₹{item.headAmount}</td>
                              <td className="py-2 text-right">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveReceiptItem(index)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t font-semibold">
                            <td className="py-2">Total Payable</td>
                            <td className="py-2" colSpan={2}>
                              ₹{formData.totalPayableAmount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTransactionContent />
    </Suspense>
  );
}
