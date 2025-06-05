"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Store } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    gcashNumber: "",
    gcashName: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Check if we've reached the 30 store limit
    const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
    if (stores.length >= 30) {
      setError("Registration is currently closed. We've reached our 30 store limit.")
      setLoading(false)
      return
    }

    // Check if email already exists
    if (stores.find((store: any) => store.email === formData.email)) {
      setError("Email already registered")
      setLoading(false)
      return
    }

    // Create new store
    const newStore = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      qrCode: `STORE_${Date.now()}`,
      products: [],
      transactions: [],
    }

    stores.push(newStore)
    localStorage.setItem("pantry_stores", JSON.stringify(stores))
    localStorage.setItem("pantry_current_store", JSON.stringify(newStore))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-pink-600" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Register Your Store
          </CardTitle>
          <CardDescription>Join our pantry pickup marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="e.g., Sarah's Sweet Treats"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gcashNumber">GCash Number</Label>
              <Input
                id="gcashNumber"
                type="tel"
                required
                value={formData.gcashNumber}
                onChange={(e) => setFormData({ ...formData, gcashNumber: e.target.value })}
                placeholder="09XXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gcashName">GCash Account Name</Label>
              <Input
                id="gcashName"
                type="text"
                required
                value={formData.gcashName}
                onChange={(e) => setFormData({ ...formData, gcashName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Store Description</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your store and specialties..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? "Creating Store..." : "Register Store"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have a store?{" "}
            <Link href="/auth/login" className="text-pink-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
