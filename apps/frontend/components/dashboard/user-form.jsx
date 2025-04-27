"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['user', 'admin']).default('user')
});

export function UserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user"
    },
    mode: "onChange" // Enable real-time validation
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      // First check if email already exists
      const checkResponse = await fetch(`http://localhost:5000/api/users/check-email?email=${encodeURIComponent(data.email)}`, {
        credentials: 'include'
      });

      const checkResult = await checkResponse.json();
      if (checkResult.exists) {
        form.setError('email', {
          type: 'manual',
          message: 'Email already exists'
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      toast.success("User created successfully!");
      form.reset();
      
      const newUser = await response.json();
      // Redirect to the new user's page
      router.push(`/dashboard/users/${newUser._id}`);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Create New User</h2>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border rounded-md"
                  disabled={isLoading}
                  {...field}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create User"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/dashboard/users')}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
      </form>
    </Form>
  );
}
