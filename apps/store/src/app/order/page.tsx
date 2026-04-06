"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  address?: string;
  items?: string;
}

function validateForm(fields: {
  name: string;
  phoneNumber: string;
  address: string;
  items: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!fields.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[\d\s()+-]{7,}$/.test(fields.phoneNumber.trim())) {
    errors.phoneNumber = "Please enter a valid phone number.";
  }

  if (!fields.address.trim()) {
    errors.address = "Delivery address is required.";
  }

  if (!fields.items.trim()) {
    errors.items = "Please list the items you'd like to order.";
  }

  return errors;
}

export default function OrderPage() {
  const router = useRouter();
  const createOrder = useMutation(api.orders.createOrder);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formErrors = validateForm({ name, phoneNumber, address, items });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createOrder({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        items: items.trim(),
        deliveryType: "delivery",
        deliveryTime: deliveryTime.trim(),
        notes: notes.trim() || undefined,
      });
      router.push("/confirmation");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-lg mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Place Your Order
        </h1>

        <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-muted-foreground">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(512) 555-1234"
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-muted-foreground">
                Delivery address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, ZIP"
                rows={3}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <Label htmlFor="items" className="text-muted-foreground">
                Items <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="items"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="List the items you'd like to order..."
                rows={4}
                className={errors.items ? "border-destructive" : ""}
              />
              {errors.items && (
                <p className="text-sm text-destructive">{errors.items}</p>
              )}
            </div>

            {/* Preferred Delivery Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-muted-foreground">
                Preferred delivery time
              </Label>
              <Input
                id="time"
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="e.g. Today at 5pm"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-muted-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or delivery instructions..."
                rows={3}
              />
            </div>

            {submitError && (
              <p className="text-sm text-destructive text-center">
                {submitError}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold text-lg py-3"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
