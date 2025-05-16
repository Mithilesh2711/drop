"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function NavHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      var user = localStorage.getItem('user');
      user = JSON.parse(user);
      if (user && user.userId) {
        const response = await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Logout failed');
        }

        // Clear local storage
        localStorage.removeItem('user');
        
        toast.success('Logged out successfully');
        router.push('/');
      }
      else {
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Dashboard
            </Link>
            <Link href="/dashboard/users" className="hover:text-gray-600">
              Users
            </Link>
            <Link href="/dashboard/plans" className="hover:text-gray-600">
              Plans
            </Link>
            <Link href="/dashboard/transactions" className="hover:text-gray-600">
              Transactions
            </Link>
            <Link href="/admin/location-codes" className="hover:text-gray-600">
              Location Codes
            </Link>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
