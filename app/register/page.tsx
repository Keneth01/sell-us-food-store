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
import { QrCode } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    phone: "",
    gcashNumber: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Check if we've reached the 30 seller limit
    const sellers = JSON.parse(localStorage.getItem("pantry_sellers") || "[]")
    if (sellers.length >= 30) {
      setError("Registration is currently closed. We've reached our 30 seller limit.")
      setLoading(false)
      return
    }

    // Check if email already exists
    if (sellers.find((seller: any) => seller.email === formData.email)) {
      setError("Email already registered")
      setLoading(false)
      return
    }

    // Create new seller
    const newSeller = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      isActive: true,
      totalSales: 0,
      rating: 0,
    }

    sellers.push(newSeller)
    localStorage.setItem("pantry_sellers", JSON.stringify(sellers))
    localStorage.setItem("pantry_current_seller", JSON.stringify(newSeller))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-pink-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <QrCode className="h-12 w-12 text-pink-600" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Join Pantry Pickup
          </CardTitle>
          <CardDescription>Register as a seller to start listing your food products</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-pink-200 focus:border-pink-400"
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
                className="border-blue-200 focus:border-blue-400"
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
                className="border-yellow-200 focus:border-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="border-pink-200 focus:border-pink-400"
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
                className="border-blue-200 focus:border-blue-400"
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
                className="border-yellow-200 focus:border-yellow-400"
                placeholder="09XXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your food business..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-pink-200 focus:border-pink-400"
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
