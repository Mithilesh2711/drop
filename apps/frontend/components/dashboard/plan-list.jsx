"use client";

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const API_BASE_URL = 'http://localhost:5000';

export function PlanList() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plans`)
      if (!response.ok) throw new Error('Failed to fetch plans')
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      toast.error('Failed to load plans')
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/plans/${planId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete plan')
      
      toast.success('Plan deleted successfully')
      fetchPlans()
    } catch (error) {
      toast.error('Failed to delete plan')
      console.error('Error deleting plan:', error)
    }
  }

  if (loading) {
    return <div>Loading plans...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plans</h2>
        <Link href="/admin/plans/add">
          <Button>Add Plan</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan._id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Monthly Charge:</strong> ₹{plan.monthlyCharge}</p>
                <p><strong>Security Deposit:</strong> ₹{plan.securityDeposit}</p>
                <p><strong>Status:</strong> {plan.status}</p>
                <div>
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/admin/plans/edit/${plan._id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="destructive" onClick={() => handleDelete(plan._id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
