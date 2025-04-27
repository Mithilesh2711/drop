"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number must be 10 digits"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      form.clearErrors();

      const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await loginResponse.json();

      if (!loginResponse.ok) {
        const errorMessage = result.message || 'Login failed';
        if (errorMessage === 'User already logged in. Please logout first.') {
          toast.error(errorMessage);
          router.push('/dashboard');
          return;
        }
        
        if (errorMessage === 'Invalid credentials') {
          form.setError('root', {
            message: 'Invalid mobile number or password'
          });
        } else {
          throw new Error(errorMessage);
        }
        return;
      }

      // Store user data in localStorage for frontend use
      if (result.userId) {
        localStorage.setItem('user', JSON.stringify({
          userId: result.userId,
          role: result.role,
          customerId: result.customerId
        }));
      }
      
      toast.success("Login successful!");
      
      // Use the redirect URL from the backend response
      router.push(result.redirect || '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your mobile number" 
                  type="tel"
                  autoComplete="tel"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
