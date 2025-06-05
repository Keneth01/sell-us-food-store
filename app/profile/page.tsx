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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, User, Package, ArrowLeft, Edit } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("sellus_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData({
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      bio: userData.bio || "",
    })

    // Load user's products
    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const userProducts = allProducts.filter((p: any) => p.sellerId === userData.id)
    setProducts(userProducts)
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Update user data
    const updatedUser = { ...user, ...formData }

    // Update in users array
    const allUsers = JSON.parse(localStorage.getItem("sellus_users") || "[]")
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser
      localStorage.setItem("sellus_users", JSON.stringify(allUsers))
    }

    // Update current user
    localStorage.setItem("sellus_current_user", JSON.stringify(updatedUser))

    // Update products with new seller name
    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const updatedProducts = allProducts.map((p: any) =>
      p.sellerId === user.id ? { ...p, sellerName: formData.name } : p,
    )
    localStorage.setItem("sellus_products", JSON.stringify(updatedProducts))

    setUser(updatedUser)
    setIsEditing(false)
    setMessage("Profile updated successfully!")
    setLoading(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-orange-600" />
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription>Member since {new Date(user.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {message && (
                  <Alert className="mb-4">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell customers about yourself and what you sell..."
                        rows={4}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Contact Information</h3>
                      <p className="text-gray-700">{user.email}</p>
                      <p className="text-gray-700">{user.phone}</p>
                      <p className="text-gray-700">{user.address}</p>
                    </div>

                    {user.bio && (
                      <div>
                        <h3 className="font-semibold mb-1">About</h3>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 pt-4 border-t">
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.round(user.rating || 0))}
                        <span className="text-sm text-gray-600 ml-1">({user.reviewCount || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Products */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold">{products.length}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available</span>
                    <span className="font-semibold">{products.filter((p) => p.available).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold">{user.reviewCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">{user.rating ? user.rating.toFixed(1) : "0.0"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products yet</p>
                ) : (
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-600">${product.price.toFixed(2)}</p>
                        </div>
                        <Badge variant={product.available ? "default" : "secondary"} className="text-xs">
                          {product.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    ))}
                    {products.length > 3 && (
                      <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="w-full">
                          View All Products
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
