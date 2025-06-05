"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

const foodCategories = [
  "Baked Goods",
  "Fresh Produce",
  "Dairy Products",
  "Meat & Poultry",
  "Seafood",
  "Beverages",
  "Snacks",
  "Condiments & Sauces",
  "Prepared Meals",
  "Desserts",
]

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("sellus_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load product
    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const foundProduct = allProducts.find((p: any) => p.id === params.id)

    if (!foundProduct || foundProduct.sellerId !== userData.id) {
      router.push("/dashboard")
      return
    }

    setProduct(foundProduct)
    setFormData({
      name: foundProduct.name,
      description: foundProduct.description,
      price: foundProduct.price.toString(),
      category: foundProduct.category,
      available: foundProduct.available,
    })
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!user || !product) return

    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Update product
    const updatedProduct = {
      ...product,
      ...formData,
      price: Number.parseFloat(formData.price),
      updatedAt: new Date().toISOString(),
    }

    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const productIndex = allProducts.findIndex((p: any) => p.id === product.id)

    if (productIndex !== -1) {
      allProducts[productIndex] = updatedProduct
      localStorage.setItem("sellus_products", JSON.stringify(allProducts))
    }

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  if (!user || !product) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600">Update your product information</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Update the information about your food product</CardDescription>
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
                  placeholder="e.g., Homemade Chocolate Cookies"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product, ingredients, preparation method..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
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
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for sale</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating Product..." : "Update Product"}
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
