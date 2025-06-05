"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

const foodCategories = ["Sweet", "Viand", "Others"]

export default function AddProductPage() {
  const router = useRouter()
  const [store, setStore] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentStore = localStorage.getItem("pantry_current_store")
    if (!currentStore) {
      router.push("/auth/login")
      return
    }
    setStore(JSON.parse(currentStore))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!store) return

    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    const stock = Number.parseInt(formData.stock)
    if (stock > 30) {
      setError("Maximum stock per product is 30 items")
      setLoading(false)
      return
    }

    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      storeId: store.id,
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: stock,
      createdAt: new Date().toISOString(),
    }

    // Update store products
    const updatedProducts = [...(store.products || []), newProduct]
    const updatedStore = { ...store, products: updatedProducts }

    // Update current store
    localStorage.setItem("pantry_current_store", JSON.stringify(updatedStore))

    // Update stores array
    const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
    const storeIndex = stores.findIndex((s: any) => s.id === store.id)
    if (storeIndex !== -1) {
      stores[storeIndex] = updatedStore
      localStorage.setItem("pantry_stores", JSON.stringify(stores))
    }

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  if (!store) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-gray-600">Add a new product to your store</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in the information about your product (max 30 items per product)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chocolate Chip Cookies"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity (max 30) *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="1-30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {foodCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
