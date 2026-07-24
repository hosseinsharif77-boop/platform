/**
 * Checkout Page
 * 
 * Multi-step checkout page.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PriceLockBanner } from '@/components/cart/PriceLockBanner';
import { useCart } from '@/features/cart/hooks';
import { Cart } from '@/features/cart/types';

const CHECKOUT_STEPS = [
  { id: 'information', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'shipping_method', label: 'Delivery' },
  { id: 'review', label: 'Review' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const [currentStep, setCurrentStep] = useState('information');
  const [priceLockExpiresAt, setPriceLockExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    shippingMethod: 'standard',
  });

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push('/marketplace');
    }
  }, [cart, cartLoading, router]);

  const handleNextStep = () => {
    const steps = CHECKOUT_STEPS.map((s) => s.id);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps = CHECKOUT_STEPS.map((s) => s.id);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <CheckoutProgress
            currentStep={currentStep}
            steps={CHECKOUT_STEPS}
          />
        </div>

        {/* Price Lock Banner */}
        {priceLockExpiresAt && (
          <div className="mb-6">
            <PriceLockBanner
              expiresAt={priceLockExpiresAt}
              onExpired={() => {
                // Handle expired lock
              }}
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Information */}
            {currentStep === 'information' && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address</Label>
                    <Input
                      id="address1"
                      value={formData.address1}
                      onChange={(e) =>
                        setFormData({ ...formData, address1: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="address2"
                      value={formData.address2}
                      onChange={(e) =>
                        setFormData({ ...formData, address2: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">ZIP Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Shipping Method */}
            {currentStep === 'shipping_method' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7' },
                    { id: 'express', name: 'Express Shipping', price: 9.99, days: '2-3' },
                    { id: 'overnight', name: 'Overnight Shipping', price: 19.99, days: '1' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors',
                        formData.shippingMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={formData.shippingMethod === method.id}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingMethod: e.target.value })
                          }
                          className="h-4 w-4 text-primary"
                        />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.days} business days
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        {method.price === 0 ? 'Free' : `$${method.price}`}
                      </p>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review */}
            {currentStep === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.firstName} {formData.lastName}
                      <br />
                      {formData.address1}
                      {formData.address2 && <>, {formData.address2}</>}
                      <br />
                      {formData.city}, {formData.state} {formData.postalCode}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.email}
                      {formData.phone && <><br />{formData.phone}</>}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 'information'}
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={loading}
              >
                {currentStep === 'review' ? 'Place Order' : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={cart.items}
              subtotal={cart.subtotal}
              shipping={0}
              tax={0}
              discount={cart.discount}
              total={cart.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
