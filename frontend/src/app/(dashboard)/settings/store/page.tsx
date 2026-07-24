/**
 * Store Settings Page
 * 
 * Store settings page for sellers.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    name: 'My Store',
    description: 'A great store with live pricing',
    contactEmail: 'store@example.com',
    contactPhone: '+1 234 567 890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    shipping: {
      enabled: true,
      freeShippingThreshold: 50,
      defaultShippingCost: 9.99,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    // TODO: Save settings
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store information
        </p>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Basic information about your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            How customers can reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>
            Your store's physical address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={settings.address.street}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  address: { ...settings.address, street: e.target.value },
                })
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={settings.address.city}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={settings.address.state}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, state: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">ZIP Code</Label>
              <Input
                id="postalCode"
                value={settings.address.postalCode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, postalCode: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
          <CardDescription>
            Configure shipping options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Shipping</Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to select shipping options
              </p>
            </div>
            <Switch
              checked={settings.shipping.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  shipping: { ...settings.shipping, enabled: checked },
                })
              }
            />
          </div>

          {settings.shipping.enabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="freeThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeThreshold"
                  type="number"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        freeShippingThreshold: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultCost">Default Shipping Cost ($)</Label>
                <Input
                  id="defaultCost"
                  type="number"
                  value={settings.shipping.defaultShippingCost}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        defaultShippingCost: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
