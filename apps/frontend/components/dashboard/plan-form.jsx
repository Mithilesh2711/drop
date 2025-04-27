"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  features: z.string().min(1, "Features are required"),
});

export function PlanForm({ planId }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      features: "",
    },
  });

  useEffect(() => {
    // TODO: Fetch plan data from API
    const planData = {
      name: "Basic Plan",
      price: "$10/month",
      features: "Feature 1, Feature 2",
    };
    form.reset(planData);
  }, [planId, form]);

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log(data);
      toast.success("Plan updated successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          {...form.register("name")}
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          {...form.register("price")}
          disabled={isLoading}
          placeholder="e.g. $10/month"
        />
        {form.formState.errors.price && (
          <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          {...form.register("features")}
          disabled={isLoading}
          placeholder="Feature 1, Feature 2, Feature 3"
        />
        {form.formState.errors.features && (
          <p className="text-sm text-red-500">{form.formState.errors.features.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="destructive" disabled={isLoading}>
          Delete Plan
        </Button>
      </div>
    </form>
  );
}
